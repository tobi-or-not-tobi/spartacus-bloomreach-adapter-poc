import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, CmsPageAdapter, provideConfig } from '@spartacus/core';
import { BannerComponent } from '@spartacus/storefront';
import { bloomreachLayoutConfig } from './layout.config';
import { BloomreachPageAdapter } from './page.adapter';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: CmsPageAdapter,
      useExisting: BloomreachPageAdapter,
    },
    provideConfig({
      cmsComponents: {
        // we could align on component types to avoid this mapping
        Banner: {
          component: BannerComponent,
        },
      },
    } as CmsConfig),

    provideConfig(bloomreachLayoutConfig),
  ],
})
export class BloomreachCmsModule {}
