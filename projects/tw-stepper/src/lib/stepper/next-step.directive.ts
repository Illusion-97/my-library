import {Directive, HostListener, Input} from '@angular/core';
import {StepperComponent} from './stepper.component';

@Directive({
  selector: '[nextStep]',
  standalone: true
})
export class NextStepDirective {

  @Input({required:true}) stepper!: StepperComponent
  @Input() nextStep: 'prev' | 'next' | 'first' | 'last' | number = 'prev'

  @HostListener("click")
  handleClick() {
    switch (this.nextStep) {
      case "next":
        this.stepper.next()
        break
      case "prev":
        this.stepper.prev()
        break
      case "first":
        this.stepper.set(0)
        break
      case "last":
        this.stepper.set(this.stepper.last)
        break
      default:
        this.stepper.set(this.nextStep)
    }
  }

}
