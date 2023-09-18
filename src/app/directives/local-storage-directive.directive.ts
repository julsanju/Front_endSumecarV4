import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appLocalStorageDirective]'
})
export class LocalStorageDirectiveDirective implements OnInit{

  @Input() appLocalStorageKey: string = '';
  @Input() appLocalStorageValue: any;

  constructor() { }

  ngOnInit() {
    if (this.appLocalStorageKey && this.appLocalStorageValue !== undefined) {
      localStorage.setItem(this.appLocalStorageKey, JSON.stringify(this.appLocalStorageValue));
    }
  }
}
