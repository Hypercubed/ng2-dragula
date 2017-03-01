import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { DragulaService } from './dragula.provider';
import { dragula } from './dragula.class';

@Directive({selector: '[dragula]'})
export class DragulaDirective implements OnInit, OnChanges {
  @Input() public dragula: string;
  @Input() public dragulaModel: any;
  @Input() public dragulaOptions: any;
  private container: any;
  private drake: any;

  private el: ElementRef;
  private dragulaService: DragulaService;
  public constructor(el: ElementRef, dragulaService: DragulaService) {
    this.el = el;
    this.dragulaService = dragulaService;
    this.container = el.nativeElement;
  }

  public ngOnInit(): void {
    let bag = this.dragulaService.find(this.dragula);
    if (bag) {
      this.drake = bag.drake;
      this.modelCheck();
      this.drake.containers.push(this.container);
    } else {
      this.drake = dragula([this.container], Object.assign({}, this.dragulaOptions));
      this.modelCheck();
      this.dragulaService.add(this.dragula, this.drake);
    }
  }

  private modelCheck() {
    if (this.dragulaModel) {
      this.drake.models = this.drake.models || [];
      this.drake.models.push({
        container: this.container,
        value: this.dragulaModel
      });
    }
  }

  public ngOnChanges(changes: {dragulaModel?: SimpleChange}): void {
    if (changes && changes.dragulaModel && this.drake) {
      if (this.drake.models) {
        const model = this.drake.models.find((d: any) => d.value === changes.dragulaModel.previousValue);
        model.value = changes.dragulaModel.currentValue;
      } else {
        this.drake.models = [{
          container: this.container,
          value: changes.dragulaModel.currentValue
        }];
      }
    }
  }
}
