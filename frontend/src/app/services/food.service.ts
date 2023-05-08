import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from 'src/data';
import { Tag } from '../shared/models/Tag';
import { NgClass } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAll():Food[]{
    return sample_foods
}
//Search Add method to Food Service
  getAllFoodsBySearchTerm(searchTerm:string) {
    return this.getAll().filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  getAllTags():Tag[]{
    return sample_tags;
}

getAllFoodsByTag(tag:string):Food[]{
  return tag === "All" ?
  this.getAll():
  this.getAll().filter(food => food.tags?.includes(tag))
}

}

