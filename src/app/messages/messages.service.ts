import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {
  private subjet = new BehaviorSubject<string[]>([]);
  errors$ : Observable<string[]> = this.subjet.asObservable()
    .pipe(
        filter(messages => messages && messages.length > 0 )
     );

  ShowErrors(...errors: string[]) {
      // Recibo a través del metodo Show el error y lo emito en el evento privado subjet.. el cual a su vez lo pasa al observable errors$ que filtra los mensajes vacios.  errors$ es el que se usa en el componente mensaje para mostrar el error en pantalla
      this.subjet.next(errors)
  }

}
