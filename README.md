# Ewa Bielak Psychotherapy Website

This is a static website for Ewa Bielak's psychotherapy practice. The website is built with HTML, CSS, and vanilla JavaScript, making it easy to deploy on GitHub Pages or any other static hosting service.

## Features

- Responsive design that works on all devices
- Bilingual support (Polish and English)
- Modern, clean UI focused on clear communication
- Sections for About, Services, Testimonials, and Contact
- Smooth scrolling navigation
- Testimonial carousel
- Contact form (requires configuration to work with a form submission service)

## Project Structure

```
ewa-website-rebuild/
├── css/
│   └── styles.css        # Main stylesheet
├── images/               # Directory for images
│   ├── favicon.png       # Website favicon
│   └── profile.jpg       # Profile photo
├── js/
│   ├── main.js           # Main JavaScript file
│   └── translations.js   # Language translations
├── index.html            # Main HTML file
└── README.md             # This file
```

## Deployment

### GitHub Pages

To deploy this website on GitHub Pages:

1. Push the code to a GitHub repository
2. Go to the repository settings
3. In the "GitHub Pages" section, select the main branch as the source
4. Save the settings and wait a few minutes for the site to be published

The website will be available at `https://yourusername.github.io/repository-name/`.

### Other Hosting Options

This is a static website, so it can be hosted on any service that supports static sites:

- Netlify
- Vercel
- Firebase Hosting
- Amazon S3
- Any traditional web hosting with file upload capability

Simply upload all the files maintaining the directory structure.

## Contact Form Configuration

The contact form currently simulates submission for demonstration purposes. To make it work with a real form submission service:

### Using Formspree

1. Create a free account at [Formspree](https://formspree.io/)
2. Get your form endpoint
3. Replace the form submission code in `main.js` with:

```javascript
// In the initContactForm function:
contactForm.setAttribute('action', 'https://formspree.io/f/your-formspree-endpoint');
contactForm.setAttribute('method', 'POST');
```

### Using Netlify Forms

If you're hosting on Netlify, add these attributes to the form in `index.html`:

```html
<form id="contactForm" class="contact-form" data-netlify="true" name="contact">
```

## Customization

### Changing Colors

Edit the CSS variables at the top of `styles.css`:

```css
:root {
    --color-primary: #4a6fa5;
    --color-primary-dark: #3a5985;
    --color-secondary: #f5f6fa;
    /* More variables... */
}
```

### Adding New Content

- **Testimonials**: Add new testimonials to the `testimonials.items` array in `translations.js`
- **Services**: Add new services to the `services.items` array in `translations.js`

### Images

Replace the images in the `images/` directory with your own:
- `profile.jpg`: Main profile photo (recommended size: 600x800px)
- `favicon.png`: Website icon (recommended size: 32x32px)

## Browser Compatibility

This website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome) 