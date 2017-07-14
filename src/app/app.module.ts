import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk';


import {
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdCardModule,
    MdTabsModule,
    MdTableModule,
    MdSortModule,
    MdCheckboxModule
} from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, FormsModule,
        BrowserAnimationsModule,
        MdToolbarModule,
        MdButtonModule,
        MdListModule,
        MdCardModule,
        MdTabsModule,
        MdTableModule,
        MdSortModule,
        CdkTableModule,
        MdCheckboxModule
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
