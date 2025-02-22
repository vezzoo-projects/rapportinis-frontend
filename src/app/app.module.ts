import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TextMaskModule } from 'angular2-text-mask'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ToolbarComponent } from './base/components//toolbar/toolbar.component'
import { FormContainer } from './base/components/form-container/form-container.component'
import { AddHeaderInterceptor } from './base/guards/addHeader.interceptor'
import { CustomDateAdapter, MaterialModule } from './material.module'
import { AuthComponent } from './modules/auth/auth.component'
import { HomeComponent } from './modules/home/home.component'

@NgModule({
    declarations: [AppComponent, AuthComponent, HomeComponent, ToolbarComponent, FormContainer],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        HttpClientModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AddHeaderInterceptor,
            multi: true,
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'it-IT',
        },
        {
            provide: DateAdapter,
            useClass: CustomDateAdapter,
        },
    ],
})
export class AppModule {}
