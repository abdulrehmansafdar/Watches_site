import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "ui-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}

@Component({
  selector: "ui-card-header",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1.5 p-6">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {}

@Component({
  selector: "ui-card-title",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-2xl font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h3>
  `,
})
export class CardTitleComponent {}

@Component({
  selector: "ui-card-content",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 ">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {}
