import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroPhone, 
  heroEnvelope, 
  heroMapPin, 
  heroClock, 
  heroQuestionMarkCircle,
  heroPlus,
  heroHandThumbUp,
  heroHandThumbDown,
  heroArrowTopRightOnSquare,
  heroChatBubbleBottomCenterText,
  heroShieldCheck,
  heroWrench,
  heroGift,
  heroCreditCard
} from '@ng-icons/heroicons/outline';

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

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  categoryId: string
  icon: string
  isOpen?: boolean
  helpfulVotes?: number
  notHelpfulVotes?: number
  additionalInfo?: boolean
  relatedLinks?: { text: string, url: string }[]
}

interface FAQCategory {
  id: string
  name: string
  icon: string
}


@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  viewProviders: [provideIcons({ 
    heroPhone, 
    heroEnvelope, 
    heroMapPin, 
    heroClock,
    heroQuestionMarkCircle,
    heroPlus,
    heroHandThumbUp,
    heroHandThumbDown,
    heroArrowTopRightOnSquare,
    heroChatBubbleBottomCenterText,
    heroShieldCheck,
    heroWrench,
    heroGift,
    heroCreditCard
  })]
})
export class ContactComponent {
  activeCategory = 'all'

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
      image: "/assets/location.jpg",
      flagship: true,
    },
   
  ]

  faqCategories: FAQCategory[] = [
    { id: 'all', name: 'All Questions', icon: 'heroQuestionMarkCircle' },
    { id: 'warranty', name: 'Warranty & Service', icon: 'heroShieldCheck' },
    { id: 'technical', name: 'Technical Support', icon: 'heroWrench' },
    { id: 'purchase', name: 'Purchase & Delivery', icon: 'heroGift' },
    { id: 'payment', name: 'Payment & Returns', icon: 'heroCreditCard' }
  ]

  faqs: FAQ[] = [
    {
      id: 1,
      question: "What is your warranty policy?",
      answer: "All Chronos timepieces come with a comprehensive 2-year international warranty covering manufacturing defects and movement issues. Our warranty includes free repairs, replacement parts, and worldwide service support through our authorized service centers.",
      category: "Warranty & Service",
      categoryId: "warranty",
      icon: "heroShieldCheck",
      helpfulVotes: 124,
      notHelpfulVotes: 8,
      additionalInfo: true,
      relatedLinks: [
        { text: "Warranty Registration", url: "/warranty-register" },
        { text: "Service Centers", url: "/service-locations" }
      ]
    },
    {
      id: 2,
      question: "Do you offer watch servicing and repairs?",
      answer: "Yes, we provide comprehensive servicing at all our boutiques and authorized service centers. We recommend regular servicing every 3-5 years to maintain optimal performance. Our certified watchmakers use only genuine parts and follow strict quality standards.",
      category: "Technical Support",
      categoryId: "technical",
      icon: "heroWrench",
      helpfulVotes: 89,
      notHelpfulVotes: 3,
      additionalInfo: true,
      relatedLinks: [
        { text: "Book Service Appointment", url: "/book-service" },
        { text: "Service Pricing", url: "/service-costs" }
      ]
    },
    {
      id: 3,
      question: "Can I customize my watch?",
      answer: "We offer various customization options including personal engraving, strap selection, dial modifications, and case material choices. Our master craftsmen can create bespoke timepieces tailored to your preferences. Contact us to discuss your vision.",
      category: "Purchase & Delivery",
      categoryId: "purchase",
      icon: "heroGift",
      helpfulVotes: 156,
      notHelpfulVotes: 12,
      additionalInfo: true,
      relatedLinks: [
        { text: "Customization Options", url: "/customize" },
        { text: "Bespoke Services", url: "/bespoke" }
      ]
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, PayPal, and offer flexible financing options. Cryptocurrency payments are available for select premium models. All transactions are secured with 256-bit SSL encryption.",
      category: "Payment & Returns",
      categoryId: "payment",
      icon: "heroCreditCard",
      helpfulVotes: 78,
      notHelpfulVotes: 5,
      additionalInfo: true,
      relatedLinks: [
        { text: "Financing Options", url: "/financing" },
        { text: "Payment Security", url: "/security" }
      ]
    },
    {
      id: 5,
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days for in-stock items. Custom and bespoke timepieces require 4-12 weeks depending on complexity. We offer express shipping options and provide tracking information for all orders. White glove delivery service is available for premium purchases.",
      category: "Purchase & Delivery",
      categoryId: "purchase",
      icon: "heroGift",
      helpfulVotes: 92,
      notHelpfulVotes: 7
    },
    {
      id: 6,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn, undamaged timepieces in original packaging. Custom and engraved items cannot be returned unless defective. Returns must be authorized in advance and include all original accessories and documentation.",
      category: "Payment & Returns",
      categoryId: "payment",
      icon: "heroCreditCard",
      helpfulVotes: 67,
      notHelpfulVotes: 15,
      additionalInfo: true,
      relatedLinks: [
        { text: "Return Process", url: "/returns" },
        { text: "Exchange Policy", url: "/exchanges" }
      ]
    }
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

  setActiveCategory(categoryId: string) {
    this.activeCategory = categoryId
  }

  getFilteredFaqs(): FAQ[] {
    if (this.activeCategory === 'all') {
      return this.faqs
    }
    return this.faqs.filter(faq => faq.categoryId === this.activeCategory)
  }

  toggleFaq(index: number) {
    const filteredFaqs = this.getFilteredFaqs()
    filteredFaqs[index].isOpen = !filteredFaqs[index].isOpen
  }

  voteFaq(index: number, helpful: boolean) {
    const filteredFaqs = this.getFilteredFaqs()
    const faq = filteredFaqs[index]
    
    if (helpful) {
      faq.helpfulVotes = (faq.helpfulVotes || 0) + 1
    } else {
      faq.notHelpfulVotes = (faq.notHelpfulVotes || 0) + 1
    }
    
    // In a real app, you'd send this to your backend
    console.log(`FAQ ${faq.id} voted as ${helpful ? 'helpful' : 'not helpful'}`)
  }
}
