import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Lesson } from '../model/lesson';

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
          map(courses => courses["payload"]),
          shareReplay()
        )
      ;
   }

   SaveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
      return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
          shareReplay()
        )
   }

   searchLesson(search: string): Observable<Lesson[]> {
      return this.http.get('/api/lessons', {
        params: {
            filter: search,
            pageSize: '100'
        }
      })
      .pipe(
          map(res => res["payload"]),
          shareReplay()
      );
   }
}
