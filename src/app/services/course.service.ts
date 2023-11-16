import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http:HttpClient) {

   }

   loadAllCourses(): Observable<Course[]> {
      const apiUrl = 'http://localhost:9000/api/courses';  
      return this.http.get<Course[]>(apiUrl)
        .pipe(
          map(courses => courses["payload"])
        )
      ;
   }
}
