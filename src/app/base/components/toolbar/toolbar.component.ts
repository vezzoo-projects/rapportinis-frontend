import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../../../modules/auth/auth.service'
import { ToolbarService } from './toolbar.service'

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
    username: string = null
    selectedDate: Date = new Date()

    private sub: Subscription

    constructor(private authService: AuthService, private toolbarService: ToolbarService) {}

    ngOnInit(): void {
        this.sub = this.authService.onUserChange.subscribe((user) => (this.username = user))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }

    get showRefresh() {
        return this.toolbarService.showRefresh
    }

    showDate(): string {
        return this.selectedDate.toLocaleDateString('it-IT')
    }

    onSelectedDateChange(event: Date) {
        this.selectedDate = event
        this.toolbarService.setSelectedDate(this.selectedDate)
    }

    refresh() {
        this.toolbarService.refresh.next()
    }

    doLogout(): void {
        this.authService.doLogout()
        this.onSelectedDateChange(new Date())
        this.username = null
    }
}
