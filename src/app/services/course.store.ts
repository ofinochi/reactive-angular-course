import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, ignoreElements, map, shareReplay, tap } from "rxjs/operators";
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
                private loading:  LoadingService,
                private messages: MessagesService){
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

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // Grabación optimista, en segundo plano y actulizando los datos en memoria 
        // de forma inmediata

        // armar el obejto a updatear
        const updatedCourse = { ...this.subject.getValue().find(course => course.id === courseId), ...changes };
        // Obtiene los cursos del observable
        const courses = this.subject.getValue();
        // Busca el indice del curso
        const courseIndex = courses.findIndex(course => course.id === courseId);
        // Actualiza el curso
        courses[courseIndex] = updatedCourse;
        // Actualiza el observable
        this.subject.next(courses);
        // Envia la ordel al servidor para actualizar el curso
        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
               catchError(err => {
                const message = "Could not sabe course: " + courseId;
                console.log(message, err);
                this.messages.ShowErrors(message);
                return throwError(err);
            }),
            // Esta acción es para que multiples llamadas subscriptas no activen la actualización
            shareReplay(),
            ignoreElements()
        );
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