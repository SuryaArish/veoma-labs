# Website Updates Summary

## Changes Implemented - March 10, 2026

### 1. Index Page Updates ✅

#### Button Text Changes
- Changed all "Get Quote" buttons to "Get a Quote" (3 instances in service cards)
- Updated services section title to "Get a Quote"

#### Indian Format Standards
- **Mobile Number Validation**: All forms now use Indian mobile format
  - Pattern: `[6-9][0-9]{9}` (10-digit validation starting with 6-9)
  - Placeholder: `+91 98765 43210`
  - Applied to: Printing, Scanning, and Designing forms

#### File Upload Restrictions (Printing Form)
- Restricted file uploads to `.stl` and `.obj` formats only
- Added file validation in JavaScript (`handleServiceSubmit` function)
- Error message displays: "Only STL or OBJ files are allowed."
- File input accept attribute: `accept=".stl,.obj"`

#### Form Field Requirements
- Z dimension field in Dimensions (mm) is mandatory (already required)
- All form fields are mandatory across the website (already implemented with `required` attribute)

### 2. 3D Printing Quote Form - New Feature ✅

#### Material Selection Dropdown
- Added new "Select Material" dropdown field
- Location: After "Upload 3D File" section, before "Project Details"
- Options available:
  - PLA
  - PLA+
  - ABS
  - TPU
  - PETG
- Field is mandatory (required attribute)
- Styled to match existing form design

### 3. Home Page Text Updates ✅

- Updated "0.1mm Layer Precision" → "0.08mm Layer Precision"
  - Changed in stats section
  - Changed in features description
- Updated "15+ Material Options" → "10+ Material Options"

### 4. Social Media Floating Icons ✅

#### Left-Side Glowing Icons
- Added Instagram icon (📷)
  - Links to: https://www.instagram.com/veoma_makerhub
- Added YouTube icon (▶️)
  - Links to: https://www.youtube.com/@veoma_labs
- Features:
  - Fixed position on left side
  - Glowing animation effect
  - Hover effects with scale and glow
  - Hidden on mobile devices (< 768px)

### 5. Career Feature (Home Page Only) ✅

#### Right-Side Floating Career Icon
- Added career icon (💼) on right side
- Opens modal popup with two options:
  - Intern (🎓)
  - Employee (💼)
- After selection, shows two contact options:
  - WhatsApp contact
  - Gmail contact
- Features:
  - Modern glowing design
  - Smooth animations
  - Responsive modal
  - Hidden on mobile devices

### 6. Footer Updates ✅

- Removed Twitter icon
- Added Udemy icon with link: https://www.udemy.com/course/3d-printing-from-basics-to-advanced-design-materials/?couponCode=GOKUL100
- Updated Instagram link with proper URL
- Updated YouTube link with proper URL
- All social links open in new tab (`target="_blank"`)

### 7. 3D Printing Workshop Page Updates ✅

- Changed "Mastery Workshop" → "Online Workshop"
- Changed badge from "🥇 Mastery" → "🥇 Online"
- Removed price section (₹11,999) from Online Workshop card
- Kept all features and functionality intact
- Updated mobile number format to Indian standard

### 8. 3D Scanning Workshop Page ✅

- Removed entire "Mastery Workshop" section
- Now displays only:
  - Foundation Workshop (₹4,499)
  - Accelerator Workshop (₹8,499)
- Updated mobile number format to Indian standard

## Files Modified

1. `/mnt/e/Veoma_labs/index.html`
   - Added floating social icons HTML
   - Added career modal HTML
   - Added CSS styles for floating elements
   - Updated form validations
   - Added material dropdown
   - Updated text content

2. `/mnt/e/Veoma_labs/js/main.js`
   - Added file validation for STL/OBJ files
   - Added career modal functions
   - Added contact link generation

3. `/mnt/e/Veoma_labs/footer.html`
   - Updated social media links
   - Removed Twitter
   - Added Udemy

4. `/mnt/e/Veoma_labs/workshop-printing.html`
   - Changed Mastery to Online Workshop
   - Removed price from Online Workshop
   - Updated mobile validation

5. `/mnt/e/Veoma_labs/workshop-scanning.html`
   - Removed Mastery Workshop section
   - Updated mobile validation

## Technical Notes

- All changes maintain existing design consistency
- No modifications to other functionality
- Mobile responsive (floating icons hidden on mobile)
- All links open in new tabs for external sites
- Form validations are client-side (HTML5 pattern attribute)
- File validation includes JavaScript check with error display

## Testing Recommendations

1. Test file upload with various file types (.stl, .obj, .pdf, .jpg)
2. Verify mobile number validation with different formats
3. Test career modal on different screen sizes
4. Verify all social media links work correctly
5. Check footer alignment on mobile and desktop
6. Test material dropdown selection in printing form
