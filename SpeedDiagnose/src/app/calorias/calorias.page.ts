import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calorias',
  templateUrl: './calorias.page.html',
  styleUrls: ['./calorias.page.scss'],
})
export class CaloriasPage implements OnInit {
  mealName: string = '';
  calories: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mealName = params['name'] || '';
      this.calories = +params['calories'] || 0;
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
