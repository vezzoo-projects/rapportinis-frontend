import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { ToolbarService } from 'src/app/base/components/toolbar/toolbar.service'
import { HttpClientService } from 'src/app/base/services/httpClient.service'
import { FocusUtils } from 'src/app/base/utils/focus.utils'
import { AuthService } from '../auth/auth.service'

interface RowData {
    activity: string
    time: string
}

interface RawRowData {
    date: string
    activity: string
    activity_id: number
}

enum CustomActivities {
    launchBreak = '--%launch-break%--',
    dayEnd = '--%day-end%--',
    total = '--%total%--',
    delta = '--%delta%--',
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('form') form: NgForm
    @ViewChild('timeField') timeField: ElementRef
    @ViewChild('activityField') activityField: ElementRef

    loading: boolean = false
    launchBreakDone: boolean = false
    dayEndDone: boolean = false
    activities = CustomActivities
    data: RowData[] = []
    rawData: RawRowData[] = []
    displayedColumns: string[] = ['activity', 'time', 'prevActivity']
    displayedRawColumns: string[] = ['activity', 'date', 'editActivity']
    editingActivity: boolean = false

    private editingActivityId: number
    private selectedDate: Date
    private subs: Subscription[] = []

    // prettier-ignore
    readonly defaultMask = [/[0-2]/, /[0-9]/, '.', /[0-5]/, /[0-9]/];
    readonly overTwentyMask = [/[0-2]/, /[0-4]/, '.', /[0-5]/, /[0-9]/]
    timeMask = this.defaultMask

    constructor(private httpService: HttpClientService, private toolbarService: ToolbarService, private authService: AuthService) {
        this.selectedDate = toolbarService.getSelectedDate()

        this.subs.push(
            this.toolbarService.selectedDate.subscribe((newDate: Date) => {
                this.selectedDate = newDate
                if (this.authService.isUserDefined()) {
                    this.fetchData()
                }
            }),
        )
    }

    ngAfterViewInit(): void {
        this.focusOnTime()
        this.listenValueChangesAndUpdateTextMask()
    }

    ngOnDestroy(): void {
        this.subs.forEach((sub) => sub?.unsubscribe())
        this.subs = []
    }

    onSubmit() {
        if (!this.editingActivity) {
            this.addActivity(<string>this.form.controls['activity'].value)
        } else {
            this.editActivity(<string>this.form.controls['activity'].value)
        }
    }

    addActivity(activity: string) {
        this.loading = true

        const body = {
            date: this.getTime(),
            activity: activity,
        }

        this.httpService.post(
            '/addActivity',
            body,
            (response) => {
                if (response) {
                    this.loading = false
                    this.focusOnTime()
                    this.resetFields()
                    this.fetchData()
                }
            },
            (error) => {
                console.error(error)
                this.loading = false
                this.focusOnTime()
            },
        )
    }

    editActivity(activity: string) {
        this.loading = true

        const body = {
            date: this.getTime(),
            activity: activity,
            activity_id: this.editingActivityId,
        }

        this.httpService.post(
            '/editActivity',
            body,
            (response) => {
                if (response) {
                    this.loading = false
                    this.focusOnTime()
                    this.resetFields()
                    this.stopEditingActivity()
                    this.fetchData()
                }
            },
            (error) => {
                console.error(error)
                this.loading = false
                this.focusOnTime()
            },
        )
    }

    startEditingActivity(activity: RawRowData) {
        this.editingActivity = true
        this.editingActivityId = activity.activity_id

        this.form.controls['time'].setValue(activity.date)
        this.form.controls['activity'].setValue(activity.activity)
        this.focusOnActivity()
    }

    stopEditingActivity() {
        this.editingActivity = false
        this.editingActivityId = null

        this.form.controls['time'].setValue(null)
        this.form.controls['activity'].setValue(null)
    }

    disableAllButtons(): boolean {
        return this.loading || this.dayEndDone || this.editingActivity
    }

    isActivityEditing(activity_id: number): boolean {
        return this.editingActivity && this.editingActivityId === activity_id
    }

    isActivityFilled(): boolean {
        return !!this.form?.controls?.['activity']?.value
    }

    isLastActivityOfList(activity: string): boolean {
        return this.rawData?.[0]?.activity === activity
    }

    hasRecords(): boolean {
        return this.data?.length > 0
    }

    private resetFields() {
        this.form.controls['time'].setValue('')
        this.form.controls['activity'].setValue('')

        setTimeout(() => {
            this.form.controls['time'].setErrors(null)
            this.form.controls['activity'].setErrors(null)
        })
    }

    private getTime() {
        const timeSplitted = (<string>this.form.controls['time'].value)?.replace(':', '.')?.split('.')
        const hours = Number(timeSplitted?.[0] || new Date().getHours())
        const minutes = Number(timeSplitted?.[1] || new Date().getMinutes())
        const date = new Date(this.selectedDate)
        date.setHours(hours, minutes, 0, 0)

        return Math.round(date.getTime() / 1000)
    }

    private focusOnTime() {
        FocusUtils.focusOnField(this.timeField)
    }

    private focusOnActivity() {
        FocusUtils.focusOnField(this.activityField)
    }

    private fetchData() {
        const date = new Date(this.selectedDate)
        date.setHours(0, 0, 0, 0)

        const body = {
            startTimestamp: Math.round(date.getTime() / 1000),
        }

        this.loading = true
        this.httpService.post(
            '/getComputedActivities',
            body,
            (response: { body: RowData[]; total: string; delta: string }) => {
                this.loading = false
                if (response) {
                    this.data = response.body

                    if (response.body?.length > 0) {
                        this.data.push({
                            activity: this.activities.total,
                            time: response.total,
                        })
                        this.data.push({
                            activity: this.activities.delta,
                            time: response.delta,
                        })
                    }
                }
            },
            (error) => {
                console.error(error)
                this.loading = false
            },
        )

        this.loading = true
        this.httpService.post(
            '/getRawActivities',
            body,
            (response: RawRowData[]) => {
                this.loading = false
                if (response) {
                    this.rawData = response.map((a) => {
                        if (a.activity === this.activities.launchBreak) {
                            return {
                                ...a,
                                activity: 'Pausa pranzo',
                            }
                        } else if (a.activity === this.activities.dayEnd) {
                            return {
                                ...a,
                                activity: 'Fine giornata',
                            }
                        } else {
                            return a
                        }
                    })
                    this.launchBreakDone = response.some((a) => a.activity === this.activities.launchBreak)
                    this.dayEndDone = response.some((a) => a.activity === this.activities.dayEnd)
                }
            },
            (error) => {
                console.error(error)
                this.loading = false
            },
        )
    }

    private listenValueChangesAndUpdateTextMask() {
        setTimeout(() =>
            this.subs.push(
                this.form.form.controls['time'].valueChanges.subscribe((value: string) => {
                    if (Number(value?.charAt(0)) === 2 && this.timeMaskIsDefault()) {
                        this.timeMask = this.overTwentyMask
                    } else if ((Number(value?.charAt(0)) === 0 || Number(value?.charAt(0)) === 1) && !this.timeMaskIsDefault()) {
                        this.timeMask = this.defaultMask
                    }
                }),
            ),
        )
    }

    private timeMaskIsDefault() {
        return this.timeMask?.[1] === this.defaultMask?.[1]
    }
}
