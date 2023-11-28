import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.scss']
})
export class CoursesCardListComponent implements OnInit{
  @Input()
  courses: Course[] = [];

  @Output()
  private courseChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {

  }

  ngOnInit() {
    
  }

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    // Luego de que se cierra la ventana , si el cierre fue exitoso debemos 
    // emitir un evento que indique que los datos han cambiando para que se actulice la información
    dialogRef.afterClosed()
      .pipe(
          filter(val => !!val),
          tap(() => this.courseChanged.emit())
      )
      .subscribe(result => {
        
      })

  }



}
