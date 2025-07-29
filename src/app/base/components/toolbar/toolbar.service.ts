import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ToolbarService {
    selectedDate = new BehaviorSubject<Date>(new Date())
    refresh = new Subject<void>()
    showRefresh = false

    setSelectedDate(date: Date): void {
        this.selectedDate.next(date)
    }

    getSelectedDate(): Date {
        return this.selectedDate.getValue()
    }
}
