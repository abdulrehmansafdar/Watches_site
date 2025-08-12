import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { Review } from "../interfaces/interfaces.model"



@Injectable({
  providedIn: "root",
})
export class ReviewService {
  private reviews: Review[] = [
   
  ]

  getReviews(productId: number): Observable<Review[]> {
    return of(this.reviews)
  }

  addReview(productId: number, review: Omit<Review, "id">): Observable<Review> {
    const newReview: Review = {
      ...review,
    }
    this.reviews.unshift(newReview)
    return of(newReview)
  }
}
