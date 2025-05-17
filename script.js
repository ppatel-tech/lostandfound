// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize database if not exists
  initDatabase();
  
  // Load recently reported items
  loadRecentItems();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize animations
  initAnimations();
});

// Database initialization
function initDatabase() {
  if (!localStorage.getItem('lostFoundDB')) {
      const sampleItems = [
          {
              id: 1,
              title: "Wireless Headphones",
              category: "electronics",
              status: "lost",
              location: "Library - Study Room 3",
              date: "2023-05-15",
              description: "Black Sony wireless headphones with noise cancellation. Left them on the table.",
              contact: "john.doe@example.com",
              image: "assets/headphones.jpg",
              reportedBy: "user1"
          },
        
          {
              id: 3,
              title: "Student ID Card",
              category: "personal",
              status: "found",
              location: "Cafeteria - Near cashier",
              date: "2023-05-13",
              description: "Student ID for Michael Johnson. Found on the floor near the cashier.",
              contact: "mike.j@example.com",
              image: "assets/student-id.jpg",
              reportedBy: "user3"
          },
          {
              id: 4,
              title: "Blue Backpack",
              category: "personal",
              status: "lost",
              location: "Bus Stop - North Campus",
              date: "2023-05-12",
              description: "Navy blue Jansport backpack with laptop compartment. Has a keychain with a small teddy bear.",
              contact: "sarah.w@example.com",
              image: "assets/backpack.jpg",
              reportedBy: "user4"
          },
          {
              id: 5,
              title: "Silver Laptop Charger",
              category: "electronics",
              status: "found",
              location: "Computer Lab - Building A",
              date: "2023-05-11",
              description: "Dell 65W laptop charger. Left plugged in at station 12.",
              contact: "tech.support@example.com",
              image: "assets/laptop-charger.jpg",
              reportedBy: "user5"
          },
          {
              id: 6,
              title: "Graphing Calculator",
              category: "electronics",
              status: "lost",
              location: "Engineering Building",
              date: "2023-05-10",
              description: "TI-84 Plus graphing calculator with a sticker of the periodic table on the back.",
              contact: "alex.g@example.com",
              image: "assets/calculator.jpg",
              reportedBy: "user6"
          },
          {
              id: 7,
              title: "Leather Wallet",
              category: "personal",
              status: "found",
              location: "Parking Lot - Section C",
              date: "2023-05-09",
              description: "Brown leather wallet containing some cash and credit cards. Owner can identify contents.",
              contact: "security@example.com",
              image: "assets/wallet.jpg",
              reportedBy: "user7"
          },
          {
              id: 8,
              title: "Chemistry Lab Notebook",
              category: "books",
              status: "lost",
              location: "Science Building - Lab 3",
              date: "2023-05-08",
              description: "Black lab notebook with 'Organic Chemistry Experiments' written on the cover.",
              contact: "emily.c@example.com",
              image: "assets/lab-notebook.jpg",
              reportedBy: "user8"
          },
          {
              id: 9,
              title: "Water Bottle",
              category: "personal",
              status: "found",
              location: "Gym - Locker Room",
              date: "2023-05-07",
              description: "Hydro Flask water bottle, 32oz, color mint green with some stickers.",
              contact: "gym.staff@example.com",
              image: "assets/water-bottle.jpg",
              reportedBy: "user9"
          },
          {
              id: 10,
              title: "Umbrella",
              category: "personal",
              status: "lost",
              location: "Student Center",
              date: "2023-05-06",
              description: "Large black umbrella with wooden handle. Left near the entrance during the rain.",
              contact: "david.m@example.com",
              image: "assets/umbrella.jpg",
              reportedBy: "user10"
          }
      ];
      
      const sampleUsers = [
          {
              id: "user1",
              name: "John Doe",
              email: "john.doe@example.com",
              password: "password123",
              phone: "555-123-4567",
              reportedItems: [1],
              claimedItems: []
          },
          {
              id: "user2",
              name: "Jane Smith",
              email: "jane.smith@example.com",
              password: "password123",
              phone: "555-987-6543",
              reportedItems: [2],
              claimedItems: []
          }
      ];
      
      const database = {
          items: sampleItems,
          users: sampleUsers,
          nextItemId: 11,
          nextUserId: 3,
          currentUser: null
      };
      
      localStorage.setItem('lostFoundDB', JSON.stringify(database));
  }
}

// Get database
function getDatabase() {
  return JSON.parse(localStorage.getItem('lostFoundDB'));
}

// Update database
function updateDatabase(db) {
  localStorage.setItem('lostFoundDB', JSON.stringify(db));
}

// Load recently reported items
function loadRecentItems(filter = 'all') {
  const db = getDatabase();
  let items = db.items;
  
  // Filter items if needed
  if (filter !== 'all') {
      items = items.filter(item => item.category === filter);
  }
  
  // Sort by most recent first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const itemsGrid = document.querySelector('.items-grid');
  itemsGrid.innerHTML = '';
  
  if (items.length === 0) {
      itemsGrid.innerHTML = '<p class="no-items">No items found. Check back later!</p>';
      return;
  }
  
  // Display up to 6 items
  const itemsToShow = items.slice(0, 6);
  
  itemsToShow.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card fade-in';
      itemCard.innerHTML = `
          <div class="item-image">
              <img src="${item.image || 'assets/default-item.jpg'}" alt="${item.title}">
          </div>
          <div class="item-details">
              <span class="item-status ${item.status === 'lost' ? 'status-lost' : 'status-found'}">
                  ${item.status === 'lost' ? 'Lost' : 'Found'}
              </span>
              <h3 class="item-title">${item.title}</h3>
              <p class="item-location">
                  <i class="fas fa-map-marker-alt"></i> ${item.location}
              </p>
              <p class="item-date">
                  <i class="far fa-calendar-alt"></i> ${formatDate(item.date)}
              </p>
              <div class="item-actions">
                  <button class="btn btn-outline view-details" data-id="${item.id}">
                      View Details
                  </button>
                  ${item.status === 'found' ? `
                  <button class="btn btn-primary claim-item" data-id="${item.id}">
                      Claim Item
                  </button>
                  ` : ''}
              </div>
          </div>
      `;
      itemsGrid.appendChild(itemCard);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', function() {
          const itemId = parseInt(this.getAttribute('data-id'));
          showItemDetails(itemId);
      });
  });
  
  document.querySelectorAll('.claim-item').forEach(btn => {
      btn.addEventListener('click', function() {
          const itemId = parseInt(this.getAttribute('data-id'));
          showClaimModal(itemId);
      });
  });
}

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show item details modal
function showItemDetails(itemId) {
  const db = getDatabase();
  const item = db.items.find(item => item.id === itemId);
  
  if (!item) return;
  
  const modalContent = `
      <div class="item-details-modal">
          <div class="item-image-large">
              <img src="${item.image || 'assets/default-item.jpg'}" alt="${item.title}">
          </div>
          <div class="item-info">
              <span class="item-status ${item.status === 'lost' ? 'status-lost' : 'status-found'}">
                  ${item.status === 'lost' ? 'Lost' : 'Found'}
              </span>
              <h2>${item.title}</h2>
              <p><strong>Category:</strong> ${capitalizeFirstLetter(item.category)}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              <p><strong>Date Reported:</strong> ${formatDate(item.date)}</p>
              <p><strong>Description:</strong></p>
              <p>${item.description}</p>
              <div class="contact-info">
                  <h3>Contact Information</h3>
                  <p>${item.contact}</p>
              </div>
          </div>
      </div>
  `;
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
      <div class="modal-content">
          <button class="close-btn">&times;</button>
          ${modalContent}
      </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
          modal.remove();
      }, 300);
  });
}

// Capitalize first letter of string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show claim modal
function showClaimModal(itemId) {
  const db = getDatabase();
  const item = db.items.find(item => item.id === itemId);
  
  if (!item) return;
  
  const modalContent = `
      <h2>Claim ${item.title}</h2>
      <p>Please provide details to verify your ownership of this item.</p>
      
      <form id="claim-form">
          <div class="form-group">
              <label for="claimer-name">Your Full Name</label>
              <input type="text" id="claimer-name" required>
          </div>
          <div class="form-group">
              <label for="claimer-email">Email</label>
              <input type="email" id="claimer-email" required>
          </div>
          <div class="form-group">
              <label for="claimer-phone">Phone Number</label>
              <input type="tel" id="claimer-phone" required>
          </div>
          <div class="form-group">
              <label for="proof-details">Proof of Ownership</label>
              <textarea id="proof-details" required placeholder="Describe unique features or provide details that prove this item belongs to you"></textarea>
          </div>
          <div class="form-group">
              <label for="captcha">Verification: What is 3 + 5?</label>
              <input type="text" id="captcha" required placeholder="Answer the question">
          </div>
          <button type="submit" class="btn btn-primary">Submit Claim</button>
      </form>
  `;
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
      <div class="modal-content">
          <button class="close-btn">&times;</button>
          ${modalContent}
      </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
          modal.remove();
      }, 300);
  });
  
  modal.querySelector('#claim-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const captchaAnswer = document.getElementById('captcha').value;
      if (captchaAnswer.trim() !== '8') {
          alert('Please enter the correct answer to the verification question.');
          return;
      }
      
      // In a real app, you would send this data to a server
      showSuccessModal(
          'Claim Submitted!', 
          'Your claim has been received. The item owner will contact you to verify and arrange return of the item.',
          'Return to Browse'
      );
      
      modal.classList.remove('active');
      setTimeout(() => {
          modal.remove();
      }, 300);
  });
}

// Show success modal
function showSuccessModal(title, message, buttonText) {
  const modalContent = `
      <div class="success-modal">
          <div class="success-icon">
              <i class="fas fa-check-circle"></i>
          </div>
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="success-actions">
              <button class="btn btn-primary close-success">${buttonText}</button>
          </div>
      </div>
  `;
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
      <div class="modal-content">
          ${modalContent}
      </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add confetti animation
  createConfetti();
  
  modal.querySelector('.close-success').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
          modal.remove();
      }, 300);
  });
}

// Create confetti animation
function createConfetti() {
  const colors = ['#FF7F50', '#4DB6AC', '#FFD166', '#E6E6FA', '#C8E6C9'];
  
  for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = -10 + 'px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(confetti);
      
      const animationDuration = Math.random() * 3 + 2;
      
      gsap.to(confetti, {
          y: window.innerHeight + 10,
          x: (Math.random() - 0.5) * 200,
          opacity: 1,
          duration: animationDuration,
          ease: 'power1.out',
          onComplete: () => {
              confetti.remove();
          }
      });
      
      gsap.to(confetti, {
          rotation: Math.random() * 360,
          duration: animationDuration
      });
  }
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          document.querySelector('.filter-btn.active').classList.remove('active');
          this.classList.add('active');
          loadRecentItems(this.getAttribute('data-filter'));
      });
  });
  
  // Login button
  document.getElementById('login-btn').addEventListener('click', () => {
      showModal('login-modal');
  });
  
  // Notification button
  document.getElementById('notification-btn').addEventListener('click', () => {
      showModal('notification-modal');
  });
  
  // Show signup from login
  document.getElementById('show-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideModal('login-modal');
      showModal('signup-modal');
  });
  
  // Show login from signup
  document.getElementById('show-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      hideModal('signup-modal');
      showModal('login-modal');
  });
  
  // Close modals when clicking outside
  document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
          e.target.classList.remove('active');
          setTimeout(() => {
              e.target.remove();
          }, 300);
      }
  });
  
  // Login form submission
  document.getElementById('login-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      const db = getDatabase();
      const user = db.users.find(user => user.email === email && user.password === password);
      
      if (user) {
          db.currentUser = user.id;
          updateDatabase(db);
          
          // Update UI
          document.getElementById('login-btn').textContent = user.name;
          hideModal('login-modal');
          
          // Show welcome message
          showSuccessModal(
              'Welcome Back!', 
              `You're now logged in as ${user.name}. You can now report and claim items.`,
              'Continue'
          );
      } else {
          alert('Invalid email or password. Please try again.');
      }
  });
  
  // Signup form submission
  document.getElementById('signup-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const phone = document.getElementById('signup-phone').value;
      
      const db = getDatabase();
      
      // Check if email already exists
      if (db.users.some(user => user.email === email)) {
          alert('This email is already registered. Please login instead.');
          return;
      }
      
      // Create new user
      const newUser = {
          id: 'user' + db.nextUserId,
          name: name,
          email: email,
          password: password,
          phone: phone,
          reportedItems: [],
          claimedItems: []
      };
      
      db.users.push(newUser);
      db.nextUserId++;
      db.currentUser = newUser.id;
      updateDatabase(db);
      
      // Update UI
      document.getElementById('login-btn').textContent = name;
      hideModal('signup-modal');
      
      // Show welcome message
      showSuccessModal(
          'Welcome!', 
          `Your account has been created successfully. You can now report and claim items.`,
          'Get Started'
      );
  });
  
  // Accordion functionality
  document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
          const item = this.parentNode;
          const isActive = item.classList.contains('active');
          
          // Close all items
          document.querySelectorAll('.accordion-item').forEach(i => {
              i.classList.remove('active');
          });
          
          // Open current if it was closed
          if (!isActive) {
              item.classList.add('active');
          }
      });
  });
  
  // Hamburger menu for mobile
  document.querySelector('.hamburger')?.addEventListener('click', function() {
      document.querySelector('.nav-links').classList.toggle('active');
  });
}

// Show modal
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Add close button event listener
      const closeBtn = modal.querySelector('.close-btn');
      if (closeBtn) {
          closeBtn.addEventListener('click', () => {
              hideModal(id);
          });
      }
  }
}

// Hide modal
function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Remove any existing event listeners to prevent duplicates
      const closeBtn = modal.querySelector('.close-btn');
      if (closeBtn) {
          closeBtn.replaceWith(closeBtn.cloneNode(true));
      }
  }
}
// Initialize animations
function initAnimations() {
  // Hero section animation
  gsap.from('.hero-content h1', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2
  });
  
  gsap.from('.hero-content p', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4
  });
  
  gsap.from('.hero-buttons', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.6
  });
  
  gsap.from('.hero-image', {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: 0.8
  });
  
  // Section animations
  gsap.from('.recent-items h2', {
      scrollTrigger: {
          trigger: '.recent-items',
          start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.8
  });
  
  gsap.from('.filter-controls', {
      scrollTrigger: {
          trigger: '.filter-controls',
          start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2
  });
  
  gsap.from('.items-grid .item-card', {
      scrollTrigger: {
          trigger: '.items-grid',
          start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1
  });
  
  gsap.from('.faq h2', {
      scrollTrigger: {
          trigger: '.faq',
          start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.8
  });
  
  gsap.from('.accordion-item', {
      scrollTrigger: {
          trigger: '.accordion',
          start: 'top 80%'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1
  });
  
  // Input focus animations
  document.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('focus', function() {
          gsap.to(this, {
              scale: 1.02,
              duration: 0.2,
              ease: 'power1.out'
          });
      });
      
      input.addEventListener('blur', function() {
          gsap.to(this, {
              scale: 1,
              duration: 0.2,
              ease: 'power1.out'
          });
      });
  });
  
  // Button hover animations
  document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
          gsap.to(this, {
              scale: 1.05,
              duration: 0.2,
              ease: 'power1.out'
          });
      });
      
      btn.addEventListener('mouseleave', function() {
          gsap.to(this, {
              scale: 1,
              duration: 0.2,
              ease: 'power1.out'
          });
      });
  });
  
  // Card hover animations
  document.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
          gsap.to(this, {
              y: -5,
              duration: 0.3,
              ease: 'power1.out'
          });
      });
      
      card.addEventListener('mouseleave', function() {
          gsap.to(this, {
              y: 0,
              duration: 0.3,
              ease: 'power1.out'
          });
      });
  });
}
