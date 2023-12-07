import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CourseService } from '../services/course.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [ LoadingService, MessagesService ]

})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesService: CourseService,
        private loadingService: LoadingService,
        private messagesService: MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });
    }

    ngAfterViewInit() {

    }

    save() {

      const changes = this.form.value;
      const saveCourse$ = this.coursesService.SaveCourse(this.course.id, changes)
          .pipe(
              catchError( err => {
                const message = 'Could not Save course';
                this.messagesService.ShowErrors(message);
                console.log('An error occurred '+message,err);
                return throwError(err)  
              })               
          )  
      ;

      this.loadingService.ShowLoaderUntilComplete(saveCourse$)
        .subscribe(
           val => { this.dialogRef.close(val);},
        //    catchError( err => {
        //     const message = 'Could not load courses';
        //     this.messagesService.ShowErrors(message);
        //     console.log('An error occurred '+message,err);
        //     return throwError(err)  
        //   })          
        )

    }

    close() {
        this.dialogRef.close();
    }

}
