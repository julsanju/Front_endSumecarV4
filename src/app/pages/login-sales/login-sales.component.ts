import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login-sales',
  templateUrl: './login-sales.component.html',
  styleUrls: ['./login-sales.component.css']
})

export class LoginSalesComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector(".container");
    const usuarioInput = this.el.nativeElement.querySelector('input[type="text"]');
    const signUp = this.el.nativeElement.querySelector(".signup-link");
    const login = this.el.nativeElement.querySelector(".login-link");

    const pwShowHide = this.el.nativeElement.querySelectorAll(".showHidePw");
    const pwFields = this.el.nativeElement.querySelectorAll(".password");

    pwShowHide.forEach((eyeIcon: any) => {
      this.renderer.listen(eyeIcon, "click", () => {
        // ... Tu código para mostrar/ocultar contraseña
      });
    });

    this.renderer.listen(signUp, "click", () => {
      if (usuarioInput.value.trim() === "") {
        alert("Por favor coloca tu nombre de usuario.");
        return;
      }
      this.renderer.addClass(container, "active");
    });

    this.renderer.listen(login, "click", () => {
      this.renderer.removeClass(container, "active");
    });
  }
}
