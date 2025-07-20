import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import {  heroPhone,heroEnvelope,heroMapPin,heroClock} from '@ng-icons/heroicons/outline';


interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string 
  message: string
  inquiryType: string
}

interface Location {
  city: string
  country: string
  address: string
  phone: string
  email: string
  hours: string
  image: string
  flagship?: boolean
}


@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, CardComponent, CardContentComponent,NgIcon
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  viewProviders: [provideIcons({ heroPhone,heroEnvelope,heroMapPin,heroClock })]
})
export class ContactComponent {

  formData: ContactForm = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  }

 

  services = [
    {
      icon: "chat",
      title: "General Inquiry",
      description: "Questions about our products or services",
    },
    {
      icon: "event",
      title: "Appointment Booking",
      description: "Schedule a visit to our boutique",
    },
    {
      icon: "support",
      title: "Technical Support",
      description: "Watch maintenance and repair services",
    },
  ]

  locations: Location[] = [
    {
      city: "Geneva",
      country: "Switzerland",
      address: "Rue du Rhône 123, 1204 Geneva",
      phone: "+41 22 123 4567",
      email: "geneva@chronos.com",
      hours: "Mon-Sat: 10:00-19:00",
      image: "/placeholder.svg?height=300&width=400",
      flagship: true,
    },
    {
      city: "New York",
      country: "United States",
      address: "Fifth Avenue 789, New York, NY 10022",
      phone: "+1 212 123 4567",
      email: "newyork@chronos.com",
      hours: "Mon-Sat: 10:00-20:00, Sun: 12:00-18:00",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      city: "Tokyo",
      country: "Japan",
      address: "Ginza 4-5-6, Chuo City, Tokyo 104-0061",
      phone: "+81 3 1234 5678",
      email: "tokyo@chronos.com",
      hours: "Mon-Sun: 10:00-20:00",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  faqs = [
    {
      question: "What is your warranty policy?",
      answer:
        "All Chronos timepieces come with a 2-year international warranty covering manufacturing defects and movement issues.",
    },
    {
      question: "Do you offer watch servicing?",
      answer:
        "Yes, we provide comprehensive servicing at all our boutiques. We recommend servicing every 3-5 years to maintain optimal performance.",
    },
    {
      question: "Can I customize my watch?",
      answer:
        "We offer various customization options including engraving, strap selection, and dial modifications. Contact us for details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, bank transfers, and financing options. Cryptocurrency payments are available for select models.",
    },
  ]

  getServiceIcon(iconName: string) {
    // Return appropriate icon based on service type
    switch (iconName) {
      case "chat":
        return heroEnvelope
      case "event":
        return heroClock
      case "support":
        return heroPhone
      default:
        return heroEnvelope
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      // Simulate form submission
      console.log("Form submitted:", this.formData)

      // Show success message (in a real app, you'd use a toast service)
      alert("Message sent successfully! We'll get back to you soon.")

      // Reset form
      this.formData = {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "",
      }
    }
  }

  private isFormValid(): boolean {
    return !!(this.formData.name && this.formData.email && this.formData.subject && this.formData.message)
  }
}
