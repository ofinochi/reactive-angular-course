import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import { Observable, throwError} from 'rxjs';
import { CoursesStore } from '../services/course.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


  constructor(
              private coursesStore: CoursesStore
    ) {

  }

  ngOnInit() {
    this.reloadCourses();  
  }

  reloadCourses() {
       
    this.beginnerCourses$ =  this.coursesStore.filterByCategory("BEGINNER");

    this.advancedCourses$ =  this.coursesStore.filterByCategory("ADVANCED") ;
  }

}




