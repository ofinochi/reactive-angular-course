import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {
   

    private subject = new BehaviorSubject<Course[]>([]);
    courses$ : Observable<Course[]> = this.subject.asObservable();
    
    constructor(private http:HttpClient,
                private loading:  LoadingService){
        this.loadAllCourses()
    }
    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    console.log(message, err);
                    return throwError(err);

                }),
                // Este evento emite la señal con los cursos para quienes esten subscriptos
                tap(courses => this.subject.next(courses))
            );
        this.loading.ShowLoaderUntilComplete(loadCourses$)
            .subscribe();
    }

     filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => courses.filter(course => course.category == category)
                .sort(sortCoursesBySeqNo)
                )
            )
    }
}