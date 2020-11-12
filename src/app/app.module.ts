import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { B2cStorefrontModule } from '@spartacus/storefront';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { BloomreachCmsModule } from './bloomreach/bloomreach-cms.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    B2cStorefrontModule.withConfig(appConfig),
    BloomreachCmsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
