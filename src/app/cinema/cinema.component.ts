import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles: any;
  public projections;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets: any;


  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes=data;
      },err=>{
        console.log(err);
      })
  }

  onGetTicketsPlaces(p){
    this.currentProjection = p
    this.cinemaService.getTicketsPlaces(p)
    .subscribe(data=>{
      this.currentProjection.tickets=data;
      this.selectedTickets=[];
    },err=>{
      console.log(err);
    })
  }
  onPayTickets(dataForm){
    let tickets=[];
    this.selectedTickets.forEach(t=>{
        tickets.push(t.id);
        console.log(tickets.toString);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm).subscribe(data=>{
    alert("Ticket Réservé avec succés")
    this.onGetTicketsPlaces(this.currentProjection);
    },err=>{console.log(err);
    });


  }

  onSelectTicket(t){
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
      }
    else {
     t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    
    };

  }

  getTicketClass(t){
  let str="btn ticket"
    if(t.reseeve==true){
  str+=" btn-danger ";
    } else if(t.selected){

    str+=" btn-warning "
    }
    else
    {
    str+= " btn-success "
    }
    return str;
  }

  onGetCinemas(v){
    this.currentVille = v;
    this.salles= undefined;
    this.currentCinema = undefined;
    this.cinemaService.getCinemas(v)
    .subscribe(data=>{
      this.cinemas=data;
    },err=>{
      console.log(err);
    })
  }
  onGetSalles(c){
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
    .subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle=>{
        this.cinemaService.getProjections(salle)
        .subscribe(data=>{
          salle.projections=data;
        },err=>{
          console.log(err);
        })
      })
    },err=>{
      console.log(err);
    })

  }

}
