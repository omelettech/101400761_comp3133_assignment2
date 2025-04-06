import {Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {routes} from './app.routes';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    // BrowserModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '101400761_comp3133_assignment2';
}
