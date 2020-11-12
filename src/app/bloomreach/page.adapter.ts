import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Configuration,
  ContainerItem,
  Document,
  ImageSet,
  initialize,
  Page as BloomreachPage,
  PageModel,
  Reference,
} from '@bloomreach/spa-sdk';
import {
  CmsBannerComponent,
  CmsPageAdapter,
  CmsStructureModel,
  ContentSlotData,
  PageContext,
} from '@spartacus/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

interface BannerModels {
  document?: Reference;
}
interface BrBannerDocument {
  content: {
    value: string;
  };
  image?: Reference;
}

@Injectable({
  providedIn: 'root',
})
export class BloomreachPageAdapter implements CmsPageAdapter {
  constructor(private httpClient: HttpClient) {}

  /**
   * Adapts the Bloomreach CMS API. We're leveraging the Bloomreach sdk
   * to get the page structure.
   *
   * TODO: We haven't mapped the pageContext.id to the request path.
   */
  load(
    pageContext: PageContext,
    fields?: string
  ): Observable<CmsStructureModel> {
    return from(
      initialize({
        endpoint: environment.bloomreachEndpoint,
        httpClient: this.bloomreachClient.bind(this),
        request: { path: '/' },
      })
    ).pipe(map((page) => this.convert(page)));
  }

  /**
   * Converts the Bloomreach API structure to the Spartacus CmsStructureModel.
   */
  protected convert(source: BloomreachPage): CmsStructureModel {
    const target = {
      components: [],
    };
    this.normalizePageData(source, target);
    this.normalizePageSlotData(source, target);
    this.normalizePageComponentData(source, target);
    return target;
  }

  /**
   * Converts page data, from `BloomreachPage` to Spartacus `Page` model.
   */
  private normalizePageData(
    source: BloomreachPage,
    target: CmsStructureModel
  ): void {
    target.page = {
      type: 'Content',
      title: source.getTitle(),
      pageId: source.getComponent().getId(),

      // the page template is driving the page layout configuration
      template: source.getComponent().getModels().pageType,

      // initialize an empty slot to ensure we can later on add specific slots
      slots: {},

      label: '/',
    };
  }

  /**
   * Converts the first level bloomreach components to PageSlots (`ContentSlotData`).
   *
   * We take the assumption that first level components are always used as slots (groups
   * of components). The slots must be configured in the `LayoutConfig` for the given page
   * template.
   */
  private normalizePageSlotData(
    source: BloomreachPage,
    target: CmsStructureModel
  ): void {
    source
      .getComponent()
      .getChildren()
      .forEach((child) => {
        target.page.slots[child.getName()] = {
          components: [],
        } as ContentSlotData;
      });
  }

  /**
   * Converts Bloomreach components to Spartacus component data. In order
   * to find the components, we must traverse the Bloomreach data model. The
   * model goes from page -> slot -> container -> component (note that these
   * are Components though).
   *
   * We have 2 approaches here:
   * 1. Convert specific data models to standard Spartacus data model
   * 2. Adjust the Bloomreach data model to Spartacus data model
   *
   * Most likely we end up with a mixture.
   */
  private normalizePageComponentData(
    source: BloomreachPage,
    target: CmsStructureModel
  ): void {
    // find all slots
    source
      .getComponent()
      .getChildren()
      .forEach((slot) => {
        // each "slot" has a container
        slot
          .getComponent()
          ?.getChildren()
          ?.forEach((container) => {
            // find all components in containers
            container
              .getComponent()
              ?.getChildren()
              ?.forEach((component) => {
                // we could get add comp parameters (i.e. styling related)
                // with component.getParameters()

                const typeCode = (component as ContainerItem).getType();
                const uid = component.getId();

                // add the component to the page structure
                target.page.slots[slot.getName()].components.push({
                  uid,
                  typeCode,
                  flexType: typeCode,
                  properties: {},
                });

                const docRef = component.getModels<BannerModels>().document;
                const data = source
                  .getContent<Document>(docRef)
                  .getData<BrBannerDocument>();

                // This conversion is debatable, as the actual document model in
                // Bloomreach is configurable and custom for the customer anyway
                const compData: CmsBannerComponent = {
                  typeCode,
                  uid,
                  content: data.content?.value,
                  media: {
                    mobile: {
                      url: source
                        .getContent<ImageSet>(data.image)
                        .getThumbnail()
                        .getUrl(),
                    },
                    tablet: {
                      url: source
                        .getContent<ImageSet>(data.image)
                        .getOriginal()
                        .getUrl(),
                      altText: source
                        .getContent<ImageSet>(data.image)
                        .getOriginal()
                        .getName(),
                    },
                  },
                };
                target.components.push(compData);
              });
          });
      });
  }

  private bloomreachClient(
    ...[{ data: body, headers, method, url }]: Parameters<
      Configuration['httpClient']
    >
  ): Promise<any> {
    return this.httpClient
      .request<PageModel>(method, url, {
        body,
        headers: headers as Record<string, string | string[]>,
        responseType: 'json',
      })
      .pipe(map((data) => ({ data })))
      .toPromise();
  }
}
