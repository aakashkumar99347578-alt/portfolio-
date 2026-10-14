/**
 * Aakash Kumar - 3D Motion Portfolio Main Controller
 * Handles 3D tilt, typewriter, interactive terminal REPL, modals, and filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. CUSTOM CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states for cursor
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tilt-element, .filter-tab');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ==========================================
  // 2. NAVBAR SCROLL EFFECT & MOBILE MENU
  // ==========================================
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuBtn.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (navMenu) navMenu.classList.remove('active');
        if (menuBtn) menuBtn.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 3. TYPEWRITER EFFECT
  // ==========================================
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'B.Tech CSE @ SVIET Punjab',
    'AI/ML & Data Analytics Developer',
    'DevHack 2026 Winner (Best AI Project)',
    'Blockchain Risk Tracer with Neo4j',
    'Python & Machine Learning Specialist',
    'NextGen Builders Team Leader'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typewriterEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 1600; // Pause at end of sentence
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before new sentence
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // ==========================================
  // 4. 3D CARD TILT & GLARE EFFECT
  // ==========================================
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-10deg to 10deg)
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // Update glare
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15), transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12), transparent 70%)`;
      }
    });
  });

  // ==========================================
  // 5. ANIMATED NUMERICAL COUNTERS
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function checkCounters() {
    if (countersStarted) return;
    const heroStats = document.querySelector('.hero-stats-card, .hero-stats-strip');
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      countersStarted = true;
      statNumbers.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeOut * target);
          counter.textContent = currentVal.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }
        requestAnimationFrame(updateCount);
      });
    }
  }
  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters(); // Initial check

  // ==========================================
  // 6. SKILLS MATRIX FILTERING
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ==========================================
  // 7. INTERACTIVE PYTHON TERMINAL REPL
  // ==========================================
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen');

  const commands = {
    help: `Available commands:
  • about       : Display developer profile summary
  • skills      : List core languages, data tools & machine learning stack
  • projects    : Show featured projects (ChainScope, IdeaJam, etc.)
  • chainscope  : Run simulated 4-hop blockchain graph risk classification
  • awards      : Display hackathon victories and credentials
  • atm         : Execute simulated Python OOP ATM Console engine
  • github      : Open Aakash's official GitHub profile
  • linkedin    : Open Aakash's official LinkedIn profile
  • clear       : Clear terminal viewport
  • contact     : Display contact channels`,

    about: `Aakash Kumar
  B.Tech Computer Science Student (2nd Year, SVIET Punjab)
  Specialization: Python, Data Analytics, Neo4j Graph Tracing, AI/ML
  Leader of NextGen Builders & DevHack 2026 Winner (DEVHACK64)`,

    skills: `Technical Arsenal:
  [Languages]   : Python 3, C, SQL
  [Data & AI]   : NumPy, Pandas, Matplotlib, Scikit-Learn, Random Forest
  [Graph DB]    : Neo4j (Cypher Query Language, Multi-Hop Tracing)
  [Tools]       : Git, GitHub, AWS, Etherscan & Blockstream APIs
  [Leadership]  : Hackathon Team Leader, Workshop Mentor (CODE CRUSADE 0.5)`,

    projects: `Featured Systems:
  1. ChainScope: Blockchain Transaction Risk Analysis (Neo4j + Random Forest AI)
  2. IdeaJam: Collaborative Hackathon Ideation Platform
  3. DSA-Python: Data Structures & Algorithmic Practice Suite
  4. ATM Console: Object-Oriented Banking Engine`,

    chainscope: `[RUNNING CHAINSCOPE RISK TRACER v1.2]
  -> Ingesting root transaction: 0x71C...4e3A
  -> Hop 1 [Neo4j]: Resolved address -> Linked to high-frequency mixer
  -> Hop 2 [Etherscan API]: Inactive account revived after 420 days
  -> Hop 3 [Blockstream API]: Split output detected (94.2% velocity)
  -> Hop 4 [Final Node]: Flagged destination exchange pool
  ==> RANDOM FOREST RISK CLASSIFIER OUTPUT:
      • Anomaly Score: 0.942 [CRITICAL RISK]
      • Flag: DORMANT_ACCOUNT_REVIVAL + RAPID_MOVEMENT
      • Recommendation: Immediate freeze & KYC audit`,

    atm: `[LAUNCHING PYTHON OOP ATM ENGINE]
  >>> class BankAccount:
  ...     def __init__(self, owner, balance=15000):
  ...         self.owner = owner
  ...         self.balance = balance
  >>> user = BankAccount("Aakash Kumar", 25000)
  >>> user.withdraw(5000)
  Withdrawal authorized: $5,000. New balance: $20,000.
  Transaction logged with timestamp sha256 checksum.`,

    awards: `Hackathon Victories:
  🥇 Best AI Project Award - DevHack 2026 (IIMT Univ; 1,150+ registrations, Team Leader)
  🤝 Best Use of Teamwork Award - HyperHack 1.0 (The Uniques Community)
  ⚡ Top 30 Offline Finalist - HackPlus Hackathon (UEM Jaipur; 1,220+ registrations)
  💡 Top 10 Team - Punjab Mission Innovation
  🇮🇳 Selected Team - Smart India Hackathon (SIH 2026, Team RegenX)`,

    github: `Opening GitHub profile: https://github.com/aakashkumar99347578-alt`,
    linkedin: `Opening LinkedIn profile: https://www.linkedin.com/in/aakash-kumar-0a457223b/`,
    contact: `Contact Transmission Info:
  • LinkedIn: linkedin.com/in/aakash-kumar-0a457223b
  • GitHub  : github.com/aakashkumar99347578-alt
  • Location: Punjab, India`
  };

  if (terminalForm && terminalInput && terminalScreen) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = terminalInput.value.trim();
      const cmd = rawInput.toLowerCase();
      if (!cmd) return;

      if (window.soundFX && window.soundFX.playKeystroke) {
        window.soundFX.playKeystroke();
      }

      // Append user command line
      const cmdLine = document.createElement('div');
      cmdLine.className = 't-line prompt-line';
      cmdLine.innerHTML = `<span class="t-user">guest@portfolio</span>:<span class="t-path">~</span>$ <span class="t-cmd">${escapeHTML(rawInput)}</span>`;
      terminalScreen.appendChild(cmdLine);

      // Handle command execution
      if (cmd === 'clear') {
        terminalScreen.innerHTML = '';
      } else if (commands[cmd]) {
        const responseLine = document.createElement('div');
        responseLine.className = 't-line response';
        responseLine.textContent = commands[cmd];
        terminalScreen.appendChild(responseLine);

        // Open links if requested
        if (cmd === 'github') {
          window.open('https://github.com/aakashkumar99347578-alt', '_blank');
        } else if (cmd === 'linkedin') {
          window.open('https://www.linkedin.com/in/aakash-kumar-0a457223b/', '_blank');
        }
      } else {
        const errLine = document.createElement('div');
        errLine.className = 't-line error';
        errLine.textContent = `zsh: command not found: ${rawInput}. Type 'help' for valid commands.`;
        terminalScreen.appendChild(errLine);
      }

      terminalInput.value = '';
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // ==========================================
  // 8. RESUME MODAL & PRINT HANDLER
  // ==========================================
  const resumeModal = document.getElementById('resume-modal');
  const quickResumeBtn = document.getElementById('quick-resume-btn');
  const closeResumeModal = document.getElementById('close-resume-modal');
  const printCvBtn = document.getElementById('print-cv-btn');

  if (quickResumeBtn && resumeModal) {
    quickResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  if (closeResumeModal && resumeModal) {
    closeResumeModal.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
      }
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 9. PROJECT ARCHITECTURE MODAL
  // ==========================================
  const projectModal = document.getElementById('project-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
  const modalProjectBody = document.getElementById('modal-project-body');

  const projectDetails = {
    chainscope: `
      <div class="project-modal-content">
        <h3 style="color: #00f3ff; font-family: var(--font-heading); margin-bottom: 0.5rem;">ChainScope: Blockchain Transaction Risk Analysis</h3>
        <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">
          Developed as the flagship hackathon project for <strong>DevHack 2026</strong>, earning the 
          <strong>Best AI Project Award</strong>. ChainScope transforms unstructured on-chain ledger transfers 
          into high-dimensional graph topologies to detect suspicious activities before capital exit.
        </p>

        <h4 style="color: #fbbf24; margin-bottom: 0.8rem; font-family: var(--font-mono);">Key Architectural Pillars:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #00f3ff; display: block; margin-bottom: 4px;">1. Neo4j Multi-Hop Graph Tracing</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Traverses wallet transaction graphs up to 4 hops deep, uncovering layered transfers and tumbling pools.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #a855f7; display: block; margin-bottom: 4px;">2. Random Forest Behavioral AI</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Trained on feature vectors containing dormancy periods, velocity variance, and split ratios to classify malicious signatures.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #10b981; display: block; margin-bottom: 4px;">3. Rule-Based Heuristic Flags</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Flags dormant-account revivals, rapid movement across distinct chains, and peel-chain behavior patterns.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #f97316; display: block; margin-bottom: 4px;">4. Real-Time API Synchronizers</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Streams live Ethereum block transactions via Etherscan API and Bitcoin UTXOs through Blockstream API.</span>
          </div>
        </div>

        <div style="background: #060911; border: 1px solid rgba(0,243,255,0.3); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.85rem; color: #a7f3d0;">
          <span style="color: #64748b;">// Cypher Query Example for 4-Hop Laundering Trace</span><br>
          MATCH path = (origin:Wallet {address: $targetAddr})-[tx:TRANSFERRED*1..4]-&gt;(dest:Wallet)<br>
          WHERE tx.velocity &gt; 0.85 AND dest.riskScore &gt; 0.75<br>
          RETURN path, reduce(totalRisk = 0, n in nodes(path) | totalRisk + n.riskScore) AS cumulativeRisk<br>
          ORDER BY cumulativeRisk DESC LIMIT 10;
        </div>
      </div>
    `,

    artisan: `
      <div class="project-modal-content">
        <h3 style="color: #fbbf24; font-family: var(--font-heading); margin-bottom: 0.5rem;">Artisan: Decentralized Fair-Trade & Craft Heritage Ecosystem</h3>
        <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">
          Engineered to connect traditional rural Indian artisans directly with global conscious consumers. 
          The platform guarantees economic fairness by eliminating predatory commission middlemen, enforcing an automated 
          <strong>75%+ artisan escrow payout</strong>, and issuing verifiable <strong>Geographical Indication (GI) digital provenance tokens</strong>.
        </p>

        <h4 style="color: #00f3ff; margin-bottom: 0.8rem; font-family: var(--font-mono);">System Architecture & Pillars:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">1. AI Fair-Value Pricing Engine</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Calculates base livable wage per hour, intricacy multipliers, natural dye sourcing costs, and geographic heritage rarity indexes.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #10b981; display: block; margin-bottom: 4px;">2. Direct Escrow Rails (UPI/Aadhaar)</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Locks customer payments in milestone escrow and dispatches 78% directly to rural artisan bank accounts upon dispatch verification.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #38bdf8; display: block; margin-bottom: 4px;">3. GI Heritage Provenance Passport</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Cryptographically seals craft origin, artisan ID, weaving cluster GPS coordinates, and historical tradition lineage to counter counterfeit mill clones.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #a855f7; display: block; margin-bottom: 4px;">4. Multilingual Voice Onboarding</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Permits non-English literate artisans in rural clusters to list crafts and listen to order requests via native audio voice prompts.</span>
          </div>
        </div>

        <div style="background: #060911; border: 1px solid rgba(245,158,11,0.35); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.85rem; color: #fef08a;">
          <span style="color: #64748b;">// Fair-Trade Pricing Formula (FastAPI Service)</span><br>
          fair_price = (material_cost + (craft_hours * state_minimum_wage * intricacy_multiplier)) / (1.0 - platform_margin_ratio)<br>
          artisan_guaranteed_share = fair_price * 0.78 &nbsp;<span style="color: #10b981;">// Enforced smart escrow threshold</span>
        </div>
      </div>
    `,

    retail_sql: `
      <div class="project-modal-content">
        <h3 style="color: #ff7043; font-family: var(--font-heading); margin-bottom: 0.5rem;">Retail Sales SQL Analytics // Pipeline Architecture</h3>
        <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">
          Engineered on PostgreSQL to perform high-throughput analytics across large-scale retail transaction ledgers.
          Eliminates data quality bottlenecks with automated sanitization pipelines and models customer retention cohorts using window functions.
        </p>

        <h4 style="color: #ff5722; margin-bottom: 0.8rem; font-family: var(--font-mono);">Analytical Pillars:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #ff7043; display: block; margin-bottom: 4px;">1. Customer Lifetime Value (LTV)</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Aggregates frequency and monetary metrics (RFM) to isolate high-yield VIP spenders from churn cohorts.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">2. Hourly Shift Velocity Engine</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Extracts transaction timestamp intervals into Morning, Afternoon, and Evening buckets to optimize store staffing.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #38bdf8; display: block; margin-bottom: 4px;">3. Demographic & Age Segmentation</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Cross-tabulates product category margins with customer age profiles to steer high-margin inventory ordering.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #10b981; display: block; margin-bottom: 4px;">4. Zero-Loss Data Sanitization</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Isolates NULL price records, enforces NOT NULL schema integrity, and validates primary transaction IDs.</span>
          </div>
        </div>

        <div style="background: #060911; border: 1px solid rgba(255,87,34,0.35); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.85rem; color: #fed7aa;">
          <span style="color: #64748b;">-- Shift Aggregation CTE Query</span><br>
          WITH hourly_shifts AS (<br>
          &nbsp;&nbsp;SELECT *, CASE WHEN EXTRACT(HOUR FROM sale_time) &lt; 12 THEN 'Morning' ELSE 'Evening' END AS shift<br>
          &nbsp;&nbsp;FROM retail_sales<br>
          )<br>
          SELECT shift, COUNT(*), SUM(total_sale) FROM hourly_shifts GROUP BY shift;
        </div>
      </div>
    `,

    zepto_sql: `
      <div class="project-modal-content">
        <h3 style="color: #ff7043; font-family: var(--font-heading); margin-bottom: 0.5rem;">Zepto Quick-Commerce SQL Intelligence // Dark Store SLA</h3>
        <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">
          Models high-frequency 10-minute micro-fulfillment operations across dense urban delivery radii.
          Monitors minute-by-minute dispatch bottlenecks, fast-moving SKU stockouts, and weather-adjusted delivery rider allocations.
        </p>

        <h4 style="color: #ff5722; margin-bottom: 0.8rem; font-family: var(--font-mono);">Operational Pillars:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #ff7043; display: block; margin-bottom: 4px;">1. 10-Minute SLA Adherence Matrix</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Tracks fulfillment intervals: picker picking time (2 mins), packing (1 min), and rider transit time (7 mins).</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">2. Automated SKU Depletion Triggers</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Calculates burn rate for milk, fresh produce, and beverages to trigger automated mother-warehouse replenishment.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #38bdf8; display: block; margin-bottom: 4px;">3. Rider Dispatch Optimization</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Monitors rider idle periods, batch delivery possibilities within 500m geofences, and peak evening incentives.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #10b981; display: block; margin-bottom: 4px;">4. Micro-Hub Capacity Balancing</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Identifies saturated dark stores and re-routes marginal orders to neighboring hubs with spare capacity.</span>
          </div>
        </div>

        <div style="background: #060911; border: 1px solid rgba(255,87,34,0.35); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.85rem; color: #fed7aa;">
          <span style="color: #64748b;">-- Dark Store Stockout Hazard Score</span><br>
          SELECT sku_id, current_stock, hourly_burn_rate,<br>
          &nbsp;&nbsp;ROUND(current_stock / NULLIF(hourly_burn_rate, 0), 2) AS hours_left<br>
          FROM darkstore_inventory WHERE current_stock &lt; 20 ORDER BY hours_left ASC;
        </div>
      </div>
    `,

    bookstore_sql: `
      <div class="project-modal-content">
        <h3 style="color: #ff7043; font-family: var(--font-heading); margin-bottom: 0.5rem;">SQL Bookstore Insights & Royalty Engine // Relational Architecture</h3>
        <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">
          Complete relational database modeling commercial publishing operations, multi-author royalty contracts,
          customer ordering behavior, and warehouse replenishment schedules with strict transactional ACID guarantees.
        </p>

        <h4 style="color: #ff5722; margin-bottom: 0.8rem; font-family: var(--font-mono);">Relational Architecture Pillars:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #ff7043; display: block; margin-bottom: 4px;">1. 3NF Normalized Schema</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Clean relational layout spanning Books, Authors, Customers, Orders, and Order_Items with foreign key constraints.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">2. Automated Royalty Settlement</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Computes author royalty shares dynamically based on contractual tiers and gross sales after return deductions.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #38bdf8; display: block; margin-bottom: 4px;">3. Stock Reorder Triggers</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Automated query filters pinpointing titles whose inventory has dropped below critical safety margins.</span>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <strong style="color: #10b981; display: block; margin-bottom: 4px;">4. Genre Margin Analysis</strong>
            <span style="color: #94a3b8; font-size: 0.88rem;">Evaluates reader acquisition costs against high-grossing categories like Indian Mythology and Literary Fiction.</span>
          </div>
        </div>

        <div style="background: #060911; border: 1px solid rgba(255,87,34,0.35); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.85rem; color: #fed7aa;">
          <span style="color: #64748b;">-- Relational Royalty Join</span><br>
          SELECT b.author_name, SUM(o.quantity * b.unit_price) * 0.15 AS royalty_inr<br>
          FROM books b JOIN order_items o ON b.book_id = o.book_id<br>
          GROUP BY b.author_name;
        </div>
      </div>
    `
  };

  viewDetailsBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      if (projectDetails[proj] && projectModal && modalProjectBody) {
        modalProjectBody.innerHTML = projectDetails[proj];
        projectModal.classList.add('active');
      }
    });
  });

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 10. INTERACTIVE CODE EXPLORER MODAL
  // ==========================================
  const codeModal = document.getElementById('code-modal');
  const closeCodeModal = document.getElementById('close-code-modal');
  const codeViewerContent = document.getElementById('code-viewer-content');
  const codeTabs = document.getElementById('code-tabs');
  const codeModalTitle = document.getElementById('code-modal-title');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const viewCodeBtns = document.querySelectorAll('.view-code-btn');

  const projectCodeFiles = {
    chainscope: {
      title: "ChainScope // Multi-Hop Graph Risk Classifier",
      tabs: [
        { name: "chainscope_tracer.py", lang: "python" },
        { name: "graph_queries.cypher", lang: "cypher" },
        { name: "risk_classifier.py", lang: "python" }
      ],
      code: {
        "chainscope_tracer.py": `"""
ChainScope - Blockchain Transaction Risk Analysis Prototype
DevHack 2026 Winner (Best AI Project Award)
Lead Author: Aakash Kumar (NextGen Builders)
"""

import os
from neo4j import GraphDatabase
import requests
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

class ChainScopeTracer:
    def __init__(self, neo4j_uri, user, password, etherscan_key):
        self.driver = GraphDatabase.driver(neo4j_uri, auth=(user, password))
        self.etherscan_key = etherscan_key
        self.clf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)

    def trace_transaction_hops(self, root_wallet_address, max_hops=4):
        """
        Executes multi-hop Cypher traversal up to 4 hops deep to uncover 
        complex laundering topologies and mixer relays.
        """
        query = """
        MATCH path = (root:Wallet {address: $rootAddr})-[tx:TRANSFERRED*1..4]->(target:Wallet)
        WHERE tx.amount > 0.05
        RETURN path, 
               [n in nodes(path) | n.address] as address_chain,
               [r in relationships(path) | r.amount] as volumes,
               target.dormant_days as dormant_period,
               target.is_mixer as mixer_flag
        """
        with self.driver.session() as session:
            result = session.run(query, rootAddr=root_wallet_address)
            hop_records = [record.data() for record in result]
            
        print(f"[+] Multi-Hop Tracing Complete: Found {len(hop_records)} downstream paths.")
        return hop_records

    def evaluate_risk_vector(self, hop_data):
        """
        Extracts velocity, dormant-account reactivation, and fan-out entropy
        to compute a unified risk score.
        """
        features = []
        for path in hop_data:
            dormancy = path.get("dormant_period", 0)
            mixer_present = 1 if path.get("mixer_flag") else 0
            hop_count = len(path.get("volumes", []))
            velocity = np.mean(path.get("volumes", [1])) / (hop_count + 1)
            features.append([dormancy, mixer_present, hop_count, velocity])

        X = np.array(features)
        # Random Forest model probability prediction
        risk_probabilities = self.clf.predict_proba(X)[:, 1]
        mean_risk = float(np.mean(risk_probabilities))
        
        return {
            "root_address": hop_data[0]["address_chain"][0] if hop_data else "N/A",
            "evaluated_paths": len(hop_data),
            "composite_risk_score": round(mean_risk, 4),
            "flag": "HIGH_ALERT" if mean_risk > 0.70 else "VERIFIED_SAFE"
        }

if __name__ == "__main__":
    print("[*] ChainScope Security Engine Initialized.")
    tracer = ChainScopeTracer("bolt://localhost:7687", "neo4j", "securepass", "ETH_API_KEY")
    result = tracer.trace_transaction_hops("0x71c526fba82928818cba124", max_hops=4)
`,
        "graph_queries.cypher": `// Neo4j Cypher Query: Multi-Hop Money Laundering & Mixer Detection
MATCH (origin:Wallet {address: $originAddress})
MATCH path = (origin)-[r:TRANSFERRED*1..4]->(dest:Wallet)
WHERE ALL(tx in r WHERE tx.amount >= 0.1)
WITH path, dest,
     reduce(s = 0, tx in r | s + tx.amount) as totalVolume,
     length(path) as hopCount
WHERE dest.dormantDays > 180 OR dest.isKnownMixer = true
RETURN 
    nodes(path) AS trace_nodes,
    totalVolume,
    hopCount,
    dest.address AS suspicious_exit_node
ORDER BY totalVolume DESC
LIMIT 25;
`,
        "risk_classifier.py": `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

def train_behavior_classifier():
    # Synthetic on-chain laundering heuristic benchmark
    np.random.seed(42)
    # Features: [Dormancy_Days, Is_Mixer, Hop_Count, Volume_Velocity]
    X_train = np.random.rand(1000, 4)
    y_train = (X_train[:, 0] * 0.4 + X_train[:, 1] * 0.5 + X_train[:, 3] * 0.3 > 0.6).astype(int)

    model = RandomForestClassifier(n_estimators=100, max_depth=10)
    model.fit(X_train, y_train)
    print("Random Forest Classifier trained for on-chain risk detection.")
    return model
`
      }
    },

    artisan: {
      title: "Artisan // Fair-Trade Marketplace & Heritage Provenance Engine",
      tabs: [
        { name: "artisan_pricing_engine.py", lang: "python" },
        { name: "craft_provenance_token.json", lang: "json" },
        { name: "escrow_settlement.py", lang: "python" }
      ],
      code: {
        "artisan_pricing_engine.py": `"""
Artisan Project - AI Fair-Value Pricing & Labor Valuation Engine
Designed & Engineered by Aakash Kumar
Empowering indigenous craftspeople with algorithmic wage guarantees.
"""

from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class CraftSpecs:
    craft_id: str
    artisan_id: str
    craft_type: str            # e.g., 'Phulkari', 'Madhubani', 'Terracotta'
    labor_hours: float         # Verified hours on handloom / wheel
    raw_material_cost_inr: float
    gi_certified: bool         # Geographical Indication status
    intricacy_score: float     # 1.0 (standard) to 3.5 (masterpiece filigree)
    state_base_hourly_wage: float = 85.0  # INR minimum livable wage benchmark

class ArtisanFairPricingEngine:
    def __init__(self, platform_fee_ratio: float = 0.08):
        # Platform fee capped strictly at 8% (covers payment gateway & delivery insurance)
        self.platform_fee_ratio = platform_fee_ratio

    def calculate_fair_market_price(self, specs: CraftSpecs) -> Dict[str, Any]:
        """
        Computes ethical fair retail price guaranteeing at least 75% 
        direct payout to the artisan, breaking the middleman exploitation cycle.
        """
        # 1. Labor valuation factoring artisan skill intricacy
        base_labor_value = specs.labor_hours * specs.state_base_hourly_wage
        skill_premium = base_labor_value * (specs.intricacy_score - 1.0) * 0.45
        gi_heritage_bonus = 350.0 if specs.gi_certified else 0.0
        
        artisan_entitled_wage = base_labor_value + skill_premium + gi_heritage_bonus

        # 2. Total production foundation
        total_artisan_claim = specs.raw_material_cost_inr + artisan_entitled_wage

        # 3. Consumer Retail Valuation (75%-80% direct to artisan)
        retail_price = total_artisan_claim / (1.0 - self.platform_fee_ratio)
        platform_fee = retail_price * self.platform_fee_ratio
        
        # Comparison with exploitative middlemen who typically take 80-85% margins
        traditional_broker_payout = retail_price * 0.15

        return {
            "craft_id": specs.craft_id,
            "retail_consumer_price_inr": round(retail_price, 2),
            "breakdown": {
                "direct_artisan_escrow": round(artisan_entitled_wage, 2),
                "raw_materials_compensation": round(specs.raw_material_cost_inr, 2),
                "platform_logistics_and_insurance": round(platform_fee, 2),
            },
            "artisan_revenue_share_pct": round(((artisan_entitled_wage + specs.raw_material_cost_inr) / retail_price) * 100, 1),
            "middleman_alternative_payout": round(traditional_broker_payout, 2),
            "artisan_gain_multiplier": round((artisan_entitled_wage + specs.raw_material_cost_inr) / traditional_broker_payout, 2)
        }

if __name__ == "__main__":
    phulkari_item = CraftSpecs(
        craft_id="CR-PB-9934",
        artisan_id="ART-7829-GURMEET",
        craft_type="Phulkari Silk Dupatta",
        labor_hours=48.0,
        raw_material_cost_inr=672.0,
        gi_certified=True,
        intricacy_score=2.2
    )

    engine = ArtisanFairPricingEngine()
    valuation = engine.calculate_fair_market_price(phulkari_item)
    print(f"[*] Fair Retail Valuation: INR {valuation['retail_consumer_price_inr']}")
    print(f"[+] Direct Artisan Payout: INR {valuation['breakdown']['direct_artisan_escrow']}")
    print(f"[+] Gain over middleman: {valuation['artisan_gain_multiplier']}x more income!")
`,
        "craft_provenance_token.json": `{
  "$schema": "https://artisan.aakash.dev/schemas/v1/craft-provenance.json",
  "provenance_token_id": "IN-GI-PB-7829-4402",
  "craft_metadata": {
    "title": "Traditional Phulkari Geometric Silk Weave",
    "gi_registration_id": "PB-GI-202",
    "cluster_region": "Patiala, Punjab, India",
    "gps_coordinates": {
      "latitude": 30.3398,
      "longitude": 76.3869
    },
    "heritage_lineage": "3rd Generation Handloom Weaving Guild",
    "raw_materials": [
      "Pure Mulberry Khaddar Silk Base",
      "Pat Silk Threads",
      "Natural Plant Dyes (Turmeric & Madder Root)"
    ]
  },
  "artisan_identity": {
    "artisan_id": "ART-7829-GURMEET",
    "full_name": "Gurmeet Kaur",
    "state_craft_board_id": "PUN-CR-8821",
    "community_mentor": true,
    "direct_payout_upi": "gurmeet.artisan@okaxis"
  },
  "creation_metrics": {
    "total_weaving_hours": 48.0,
    "completed_timestamp": "2026-03-28T14:30:00Z",
    "inspection_passed": true,
    "authenticity_hash": "e9c1b3f721a94dd892c55490e87b7a9f2430"
  }
}`,
        "escrow_settlement.py": `"""
Artisan Escrow Settlement Rails
Triggers instant direct-to-bank distribution when courier scans delivery or QR proof of craft reception.
"""

from typing import Dict, Any
from datetime import datetime

class ArtisanEscrowDispatcher:
    def __init__(self, db_session):
        self.db = db_session

    def release_artisan_milestone(self, order_id: str, tracking_status: str) -> Dict[str, Any]:
        """
        Releases funds without middlemen retention.
        """
        if tracking_status not in ["PICKED_UP_BY_COURIER", "DELIVERED"]:
            return {"status": "HELD_IN_ESCROW", "reason": "Awaiting shipment handoff."}

        order = self.db.find_order(order_id)
        artisan_amount = order.get("artisan_escrow_amount", 3744.0)
        artisan_upi = order.get("artisan_upi", "gurmeet.artisan@okaxis")

        # Trigger Instant Banking Settlement API (UPI / IMPS Rails)
        tx_reference = f"TX-ARTISAN-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        print(f"[+] Released INR {artisan_amount} directly to {artisan_upi}. Tx: {tx_reference}")
        return {
            "status": "SETTLED_TO_ARTISAN",
            "amount_inr": artisan_amount,
            "destination": artisan_upi,
            "tx_ref": tx_reference,
            "zero_middleman_guarantee": True
        }
`
      }
    },

    dsa: {
      title: "DSA Python Suite // Algorithms & Data Structures",
      tabs: [
        { name: "dsa_algorithms.py", lang: "python" },
        { name: "graph_traversals.py", lang: "python" }
      ],
      code: {
        "dsa_algorithms.py": `"""
Aakash Kumar - DSA Python Mastery Suite
Essential implementations of optimal algorithmic patterns.
"""

from collections import deque
from typing import List, Dict, Optional

class DSASuite:
    @staticmethod
    def binary_search(arr: List[int], target: int) -> int:
        """O(log N) Binary Search on sorted array."""
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = (low + high) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1

    @staticmethod
    def two_sum_hash(nums: List[int], target: int) -> List[int]:
        """O(N) Two Sum utilizing hash map lookup."""
        seen: Dict[int, int] = {}
        for idx, val in enumerate(nums):
            complement = target - val
            if complement in seen:
                return [seen[complement], idx]
            seen[val] = idx
        return []

    @staticmethod
    def fibonacci_memoized(n: int, memo: Dict[int, int] = {}) -> int:
        """O(N) Dynamic Programming with memoization."""
        if n in memo: return memo[n]
        if n <= 1: return n
        memo[n] = DSASuite.fibonacci_memoized(n - 1, memo) + DSASuite.fibonacci_memoized(n - 2, memo)
        return memo[n]

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    print(f"Two Sum result for target 9: {DSASuite.two_sum_hash(nums, 9)}")
    print(f"Fibonacci(30): {DSASuite.fibonacci_memoized(30)}")
`,
        "graph_traversals.py": `from collections import deque

def bfs_shortest_path(graph, start, goal):
    """Breadth-First Search for shortest unweighted path."""
    explored = set()
    queue = deque([[start]])

    if start == goal:
        return [start]

    while queue:
        path = queue.popleft()
        node = path[-1]

        if node not in explored:
            neighbours = graph.get(node, [])
            for neighbour in neighbours:
                new_path = list(path)
                new_path.append(neighbour)
                queue.append(new_path)
                if neighbour == goal:
                    return new_path
            explored.add(node)
    return None
`
      }
    },

    atm: {
      title: "ATM System Console // Python OOP Architecture",
      tabs: [
        { name: "atm_engine.py", lang: "python" }
      ],
      code: {
        "atm_engine.py": `"""
ATM System Console - Python Object-Oriented Architecture
Clean State, Encapsulation, and Secure Transaction Ledger
Author: Aakash Kumar
"""

import hashlib
from datetime import datetime

class BankAccount:
    def __init__(self, account_no: str, account_holder: str, pin_hash: str, balance: float = 0.0):
        self._account_no = account_no
        self.account_holder = account_holder
        self._pin_hash = pin_hash
        self._balance = balance
        self._ledger = []

    def verify_pin(self, entered_pin: str) -> bool:
        hashed = hashlib.sha256(entered_pin.encode()).hexdigest()
        return hashed == self._pin_hash

    def check_balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> bool:
        if amount <= 0:
            return False
        self._balance += amount
        self._log_transaction("DEPOSIT", amount)
        return True

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self._balance:
            self._balance -= amount
            self._log_transaction("WITHDRAWAL", amount)
            return True
        return False

    def _log_transaction(self, tx_type: str, amount: float):
        entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "type": tx_type,
            "amount": amount,
            "remaining_balance": self._balance
        }
        self._ledger.append(entry)

    def print_mini_statement(self):
        print(f"\\n--- MINI STATEMENT FOR {self.account_holder} ---")
        for tx in self._ledger[-5:]:
            print(f"[{tx['timestamp']}] {tx['type']}: $\${tx['amount']} | Bal: $\${tx['remaining_balance']}")
`
      }
    },

    ideajam: {
      title: "IdeaJam Portal // Hackathon Ideation System",
      tabs: [
        { name: "IdeaJam_Store.js", lang: "javascript" }
      ],
      code: {
        "IdeaJam_Store.js": `/**
 * IdeaJam Hackathon Ideation Platform
 * Real-time Proposition Engine & Team Formation
 */

export class IdeaJamStore {
  constructor() {
    this.ideas = [
      { id: 1, title: "AI Health Triaging Bot", author: "Aakash", votes: 42, tags: ["AI", "Web3"] },
      { id: 2, title: "Smart Campus Parking Matrix", author: "SVIET Club", votes: 29, tags: ["IoT"] }
    ];
  }

  submitProposal(title, author, tags = []) {
    const newProposal = {
      id: Date.now(),
      title,
      author,
      votes: 1,
      tags
    };
    this.ideas.unshift(newProposal);
    return newProposal;
  }

  upvote(id) {
    const target = this.ideas.find(i => i.id === id);
    if (target) {
      target.votes += 1;
      return target.votes;
    }
    return 0;
  }
}
`
      }
    },

    retail_sql: {
      title: "Retail Sales SQL Analytics // PostgreSQL Query Suite",
      tabs: [
        { name: "retail_sales_analysis.sql", lang: "sql" },
        { name: "schema_ddl.sql", lang: "sql" }
      ],
      code: {
        "retail_sales_analysis.sql": `-- ========================================================
-- RETAIL SALES SQL ANALYTICS & REVENUE INTELLIGENCE
-- Author: Aakash Kumar
-- Repository: https://github.com/aakashkumar99347578-alt/retail_sale_sql_project
-- Database: PostgreSQL
-- ========================================================

-- 1. DATA CLEANING: Remove Records with Null Critical Values
DELETE FROM retail_sales
WHERE 
    transactions_id IS NULL OR
    sale_date IS NULL OR
    customer_id IS NULL OR
    gender IS NULL OR
    category IS NULL OR
    quantiy IS NULL OR
    price_per_unit IS NULL OR
    cogs IS NULL OR
    total_sale IS NULL;

-- 2. CORE KPI: Total Revenue, Distinct Orders & Customer Reach
SELECT 
    COUNT(DISTINCT transactions_id) AS total_orders,
    COUNT(DISTINCT customer_id) AS total_unique_customers,
    ROUND(SUM(total_sale), 2) AS gross_revenue,
    ROUND(AVG(total_sale), 2) AS avg_order_value
FROM retail_sales;

-- 3. CUSTOMER LIFETIME VALUE: Top 5 Highest Spenders
SELECT 
    customer_id,
    COUNT(transactions_id) AS total_orders,
    SUM(total_sale) AS total_spend,
    ROUND(AVG(total_sale), 2) AS avg_spend_per_visit
FROM retail_sales
GROUP BY customer_id
ORDER BY total_spend DESC
LIMIT 5;

-- 4. TEMPORAL SHIFT ANALYSIS: Hourly Order Velocity
WITH hourly_sales AS (
    SELECT *,
        CASE 
            WHEN EXTRACT(HOUR FROM sale_time) < 12 THEN 'Morning'
            WHEN EXTRACT(HOUR FROM sale_time) BETWEEN 12 AND 17 THEN 'Afternoon'
            ELSE 'Evening'
        END AS shift
    FROM retail_sales
)
SELECT 
    shift,
    COUNT(*) AS total_transactions,
    ROUND(SUM(total_sale), 2) AS shift_revenue
FROM hourly_sales
GROUP BY shift
ORDER BY shift_revenue DESC;

-- 5. DEMOGRAPHIC SEGMENTATION: Product Category by Gender & Age
SELECT 
    category,
    gender,
    ROUND(AVG(age), 1) AS avg_customer_age,
    SUM(quantiy) AS total_units_sold,
    ROUND(SUM(total_sale), 2) AS category_revenue
FROM retail_sales
GROUP BY category, gender
ORDER BY category, category_revenue DESC;
`,
        "schema_ddl.sql": `-- Database Schema for Retail Sales Data Analytics
CREATE TABLE IF NOT EXISTS retail_sales (
    transactions_id INT PRIMARY KEY,
    sale_date DATE NOT NULL,
    sale_time TIME NOT NULL,
    customer_id INT NOT NULL,
    gender VARCHAR(15),
    age INT,
    category VARCHAR(35) NOT NULL,
    quantiy INT NOT NULL CHECK (quantiy > 0),
    price_per_unit NUMERIC(10, 2) NOT NULL,
    cogs NUMERIC(10, 2) NOT NULL,
    total_sale NUMERIC(10, 2) NOT NULL
);

-- Indexing for Query Acceleration
CREATE INDEX idx_retail_customer ON retail_sales(customer_id);
CREATE INDEX idx_retail_sale_date ON retail_sales(sale_date);
CREATE INDEX idx_retail_category ON retail_sales(category);
`
      }
    },

    zepto_sql: {
      title: "Zepto Quick-Commerce SQL // 10-Minute Dark Store SLA Analytics",
      tabs: [
        { name: "darkstore_sla_metrics.sql", lang: "sql" },
        { name: "inventory_depletion.sql", lang: "sql" }
      ],
      code: {
        "darkstore_sla_metrics.sql": `-- ========================================================
-- ZEPTO QUICK-COMMERCE SQL INTELLIGENCE & DARK STORE ANALYTICS
-- Author: Aakash Kumar
-- Repository: https://github.com/aakashkumar99347578-alt/zepto_sql_project
-- Focus: 10-Minute SLA Adherence, Dispatch Speed & Dark Store Throughput
-- ========================================================

-- 1. 10-MINUTE DELIVERY SLA COMPLIANCE BY DARK STORE HUB
SELECT 
    hub_id,
    hub_location,
    COUNT(order_id) AS total_orders_handled,
    ROUND(AVG(delivery_time_mins), 2) AS avg_delivery_time,
    ROUND(
        SUM(CASE WHEN delivery_time_mins <= 10.0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
        2
    ) AS sla_compliance_pct,
    ROUND(
        SUM(CASE WHEN delivery_time_mins > 15.0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
        2
    ) AS critical_delay_pct
FROM zepto_orders
GROUP BY hub_id, hub_location
HAVING COUNT(order_id) >= 100
ORDER BY sla_compliance_pct DESC;

-- 2. PEAK SURGE RIDER ALLOCATION & HOURLY LOAD
SELECT 
    EXTRACT(HOUR FROM order_timestamp) AS order_hour,
    COUNT(*) AS total_hourly_orders,
    ROUND(AVG(rider_wait_time_secs) / 60.0, 2) AS avg_rider_wait_mins,
    ROUND(AVG(delivery_time_mins), 2) AS avg_delivery_mins
FROM zepto_orders
GROUP BY EXTRACT(HOUR FROM order_timestamp)
ORDER BY total_hourly_orders DESC;
`,
        "inventory_depletion.sql": `-- High-Velocity SKU Depletion & Automated Reorder Alert
SELECT 
    sku_id,
    product_name,
    category,
    current_inventory,
    hourly_consumption_rate,
    ROUND(current_inventory / NULLIF(hourly_consumption_rate, 0), 1) AS hours_until_depletion,
    CASE 
        WHEN current_inventory <= 10 THEN 'CRITICAL_STOCKOUT_RISK'
        WHEN current_inventory <= 25 THEN 'REORDER_NOW'
        ELSE 'HEALTHY'
    END AS inventory_health_status
FROM darkstore_sku_inventory
WHERE current_inventory < 30
ORDER BY hours_until_depletion ASC;
`
      }
    },

    bookstore_sql: {
      title: "SQL Bookstore Insights // Relational Warehouse & Author Royalty Splitter",
      tabs: [
        { name: "author_royalties.sql", lang: "sql" },
        { name: "bookstore_schema.sql", lang: "sql" }
      ],
      code: {
        "author_royalties.sql": `-- ========================================================
-- SQL BOOKSTORE INSIGHTS & AUTHOR ROYALTY CALCULATION
-- Author: Aakash Kumar
-- Repository: https://github.com/aakashkumar99347578-alt/sql-bookstore-insights
-- Focus: Multi-Table Joins, 15% Contractual Royalty Splits & Reorders
-- ========================================================

-- 1. AUTHOR ROYALTY SETTLEMENT LEDGER (15% Contractual Royalty)
SELECT 
    b.author_name,
    COUNT(DISTINCT b.book_id) AS distinct_titles,
    SUM(o.quantity) AS total_copies_sold,
    ROUND(SUM(o.quantity * b.unit_price), 2) AS gross_sales_inr,
    ROUND(SUM(o.quantity * b.unit_price) * 0.15, 2) AS author_net_royalty_payout
FROM books b
JOIN order_items o ON b.book_id = o.book_id
GROUP BY b.author_name
ORDER BY gross_sales_inr DESC;

-- 2. TOP PERFORMING GENRES & AVERAGE BOOK PRICE
SELECT 
    genre,
    COUNT(book_id) AS available_titles,
    ROUND(AVG(unit_price), 2) AS avg_price,
    SUM(stock_quantity) AS current_warehouse_stock
FROM books
GROUP BY genre
ORDER BY available_titles DESC;

-- 3. INVENTORY REORDER TRIGGERS (Stock <= Reorder Threshold)
SELECT 
    book_id,
    title,
    author_name,
    stock_quantity,
    reorder_level,
    (reorder_level - stock_quantity + 20) AS recommended_restock_units
FROM books
WHERE stock_quantity <= reorder_level
ORDER BY stock_quantity ASC;
`,
        "bookstore_schema.sql": `-- Relational Normalized Schema for Bookstore Intelligence
CREATE TABLE authors (
    author_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    royalty_pct NUMERIC(4,2) DEFAULT 15.00
);

CREATE TABLE books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES authors(author_id),
    author_name VARCHAR(100),
    genre VARCHAR(50),
    unit_price NUMERIC(8,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 15
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10,2)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    book_id INT REFERENCES books(book_id),
    quantity INT NOT NULL,
    price_at_sale NUMERIC(8,2) NOT NULL
);
`
      }
    }
  };

  viewCodeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const codeKey = btn.getAttribute('data-code');
      const project = projectCodeFiles[codeKey];
      if (!project || !codeModal) return;

      codeModalTitle.textContent = project.title;
      codeTabs.innerHTML = '';

      // Populate tabs
      project.tabs.forEach((tab, index) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `code-tab-btn ${index === 0 ? 'active' : ''}`;
        tabBtn.textContent = tab.name;
        tabBtn.addEventListener('click', () => {
          document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
          tabBtn.classList.add('active');
          codeViewerContent.textContent = project.code[tab.name];
        });
        codeTabs.appendChild(tabBtn);
      });

      // Set initial file content
      const firstFileName = project.tabs[0].name;
      codeViewerContent.textContent = project.code[firstFileName];

      codeModal.classList.add('active');

      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  });

  if (closeCodeModal && codeModal) {
    closeCodeModal.addEventListener('click', () => codeModal.classList.remove('active'));
    codeModal.addEventListener('click', (e) => {
      if (e.target === codeModal) codeModal.classList.remove('active');
    });
  }

  if (copyCodeBtn && codeViewerContent) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeViewerContent.textContent).then(() => {
        const orig = copyCodeBtn.textContent;
        copyCodeBtn.textContent = "✅ Copied!";
        setTimeout(() => copyCodeBtn.textContent = orig, 2000);
      });
    });
  }

  // ==========================================
  // 11. IN-CARD CHAINSCOPE NODE INSPECTOR
  // ==========================================
  const nodes = document.querySelectorAll('.node-graph-mockup .node');
  const inspectName = document.getElementById('inspect-name');
  const inspectRisk = document.getElementById('inspect-risk');
  const inspectDetails = document.getElementById('inspect-details');

  const nodeData = {
    origin: {
      name: "Target Wallet (Origin 0x71c...4e3a)",
      risk: "AI Risk: 0.94 [CRITICAL]",
      riskClass: "danger",
      desc: "Root account initiating anomalous high-velocity token dispersion to multiple relay proxies."
    },
    mixer: {
      name: "Hop 1: Tornado/Mixer Pool Contract",
      risk: "Mixer Flag: 0.88 [HIGH RISK]",
      riskClass: "warning",
      desc: "Incoming tokens routed through pooling smart contract with zero KYC to obscure provenance."
    },
    dormant: {
      name: "Hop 2: Revived Dormant Account (420 Days Inactive)",
      risk: "Pattern: DORMANT_REVIVAL [ALARM]",
      riskClass: "danger",
      desc: "Account remained zero-activity for 420 days prior to sudden $180,000 equivalent token receipt."
    },
    exchange: {
      name: "Hop 3: Centralized Exchange Liquidity Vault",
      risk: "Clean Exit Flag: 0.12 [MONITORED]",
      riskClass: "clean",
      desc: "Destination address intercepted at CEX deposit pool; automated freeze alert dispatched."
    }
  };

  nodes.forEach((n) => {
    n.addEventListener('click', () => {
      nodes.forEach(el => el.classList.remove('active-node'));
      n.classList.add('active-node');

      const key = n.getAttribute('data-node');
      const data = nodeData[key];
      if (data && inspectName && inspectRisk && inspectDetails) {
        inspectName.textContent = data.name;
        inspectRisk.textContent = data.risk;
        inspectRisk.className = `inspect-badge ${data.riskClass}`;
        inspectDetails.textContent = data.desc;
        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      }
    });
  });

  // ==========================================
  // IN-CARD ARTISAN FAIR-TRADE CALCULATOR & PROVENANCE
  // ==========================================
  const craftChips = document.querySelectorAll('.artisan-craft-selector .craft-chip');
  const craftIcon = document.getElementById('craft-icon');
  const craftTitle = document.getElementById('craft-title');
  const craftOrigin = document.getElementById('craft-origin');
  const craftPrice = document.getElementById('craft-price');
  const segArtisan = document.getElementById('seg-artisan');
  const segMaterial = document.getElementById('seg-material');
  const segPlatform = document.getElementById('seg-platform');
  const artisanPayoutText = document.getElementById('artisan-payout-text');
  const materialText = document.getElementById('material-text');
  const platformText = document.getElementById('platform-text');
  const certId = document.getElementById('cert-id');
  const certDetails = document.getElementById('cert-details');
  const verifyArtisanBtn = document.getElementById('verify-artisan-btn');
  const provenanceCert = document.getElementById('provenance-cert');

  const craftDatabase = {
    phulkari: {
      title: "Handspun Phulkari Silk Dupatta",
      origin: "Origin: Patiala Craft Cluster, Punjab • GI Tagged #PB-GI-202",
      icon: "🧵",
      price: "₹4,800",
      artisanPct: "78%",
      artisanPayout: "₹3,744",
      middlemanComp: "(vs ₹620 conventional broker)",
      materials: "₹672",
      materialsPct: "14%",
      platform: "₹384",
      platformPct: "8%",
      certId: "IN-GI-PB-7829",
      certDetails: "Verified Master Craftsman: Gurmeet Kaur • 48 Working Hours"
    },
    madhubani: {
      title: "Madhubani Traditional Mithila Canvas",
      origin: "Origin: Jitwarpur, Madhubani, Bihar • GI Tagged #BR-GI-142",
      icon: "🎨",
      price: "₹6,200",
      artisanPct: "80%",
      artisanPayout: "₹4,960",
      middlemanComp: "(vs ₹850 conventional broker)",
      materials: "₹744",
      materialsPct: "12%",
      platform: "₹496",
      platformPct: "8%",
      certId: "IN-GI-BR-5510",
      certDetails: "Verified Master Artisan: Sita Devi Guild • 64 Handwork Hours"
    },
    terracotta: {
      title: "Bankura Terracotta Temple Vessel",
      origin: "Origin: Panchmura, Bankura, West Bengal • GI Tagged #WB-GI-98",
      icon: "🏺",
      price: "₹3,400",
      artisanPct: "76%",
      artisanPayout: "₹2,584",
      middlemanComp: "(vs ₹420 conventional broker)",
      materials: "₹544",
      materialsPct: "16%",
      platform: "₹272",
      platformPct: "8%",
      certId: "IN-GI-WB-3319",
      certDetails: "Verified Master Potter: Shyamal Kumbhakar • 32 Wheel Hours"
    },
    bluepottery: {
      title: "Jaipur Traditional Blue Glaze Urn",
      origin: "Origin: Sanganer, Jaipur, Rajasthan • GI Tagged #RJ-GI-177",
      icon: "✨",
      price: "₹5,400",
      artisanPct: "79%",
      artisanPayout: "₹4,266",
      middlemanComp: "(vs ₹710 conventional broker)",
      materials: "₹702",
      materialsPct: "13%",
      platform: "₹432",
      platformPct: "8%",
      certId: "IN-GI-RJ-8891",
      certDetails: "Verified Master Artisan: Kripal Singh Workshop • 42 Kiln Hours"
    }
  };

  if (craftChips.length > 0) {
    craftChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        craftChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-craft');
        const item = craftDatabase[key];
        if (!item) return;

        if (craftIcon) craftIcon.textContent = item.icon;
        if (craftTitle) craftTitle.textContent = item.title;
        if (craftOrigin) craftOrigin.textContent = item.origin;
        if (craftPrice) craftPrice.textContent = item.price;

        if (segArtisan) {
          segArtisan.style.width = item.artisanPct;
          segArtisan.querySelector('span').textContent = `Artisan ${item.artisanPct}`;
        }
        if (segMaterial) {
          segMaterial.style.width = item.materialsPct;
          segMaterial.querySelector('span').textContent = `Materials ${item.materialsPct}`;
        }
        if (segPlatform) {
          segPlatform.style.width = item.platformPct;
          segPlatform.querySelector('span').textContent = item.platformPct;
        }

        if (artisanPayoutText) {
          artisanPayoutText.innerHTML = `Direct Artisan Escrow: <strong>${item.artisanPayout}</strong> <em class="middleman-comp">${item.middlemanComp}</em>`;
        }
        if (materialText) {
          materialText.innerHTML = `Raw Materials: <strong>${item.materials}</strong>`;
        }
        if (platformText) {
          platformText.innerHTML = `Logistics: <strong>${item.platform}</strong>`;
        }

        if (certId) certId.textContent = item.certId;
        if (certDetails) certDetails.textContent = item.certDetails;

        if (verifyArtisanBtn) {
          verifyArtisanBtn.classList.remove('verified');
          verifyArtisanBtn.innerHTML = `<span>✓ Verify Authenticity</span>`;
        }

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  if (verifyArtisanBtn) {
    verifyArtisanBtn.addEventListener('click', () => {
      verifyArtisanBtn.classList.add('verified');
      verifyArtisanBtn.innerHTML = `<span>✅ GI Provenance Verified</span>`;

      if (provenanceCert) {
        provenanceCert.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.4)";
        setTimeout(() => {
          provenanceCert.style.boxShadow = "none";
        }, 1500);
      }

      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  }

  // ==========================================
  // 12. IN-CARD IDEAJAM INTERACTIVE VOTING
  // ==========================================
  const ideaFeed = document.getElementById('idea-feed');
  const newIdeaInput = document.getElementById('new-idea-input');
  const addIdeaBtn = document.getElementById('add-idea-btn');

  function attachVoteListeners() {
    document.querySelectorAll('.upvote-btn').forEach((btn) => {
      btn.onclick = () => {
        let count = parseInt(btn.getAttribute('data-votes'), 10) + 1;
        btn.setAttribute('data-votes', count);
        btn.querySelector('.vote-count').textContent = count;
        btn.style.transform = "scale(1.15)";
        setTimeout(() => btn.style.transform = "scale(1)", 150);
        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      };
    });
  }
  attachVoteListeners();

  if (addIdeaBtn && newIdeaInput && ideaFeed) {
    addIdeaBtn.addEventListener('click', () => {
      const text = newIdeaInput.value.trim();
      if (!text) return;

      const newIdea = document.createElement('div');
      newIdea.className = 'idea-item';
      newIdea.innerHTML = `
        <div class="idea-content">
          <strong>${escapeHTML(text)}</strong>
          <span class="idea-author">by Guest • Just now</span>
        </div>
        <button class="upvote-btn" data-votes="1">
          ▲ <span class="vote-count">1</span>
        </button>
      `;
      ideaFeed.prepend(newIdea);
      newIdeaInput.value = '';
      attachVoteListeners();
      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  }

  // ==========================================
  // 13. IN-CARD DSA ALGORITHM RUNNER
  // ==========================================
  const algoPicker = document.getElementById('algo-picker');
  const runAlgoBtn = document.getElementById('run-algo-btn');
  const algoOutput = document.getElementById('algo-output');

  if (runAlgoBtn && algoPicker && algoOutput) {
    runAlgoBtn.addEventListener('click', () => {
      const choice = algoPicker.value;
      algoOutput.innerHTML = `<span style="color: #38bdf8;">Executing algorithm simulation...</span>`;

      setTimeout(() => {
        if (choice === 'bfs') {
          algoOutput.innerHTML = `[GRAPH BFS TRAVERSAL]\\nInput: Nodes {A, B, C, D, E}\\nTraversal Queue: A -> B, C -> D, E\\nShortest Path [A -> E]: Found in 2 hops!\\nComplexity: O(V + E) = 0.042ms`;
        } else if (choice === 'binary_search') {
          algoOutput.innerHTML = `[OPTIMIZED BINARY SEARCH]\\nSorted Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\\nSearch Target: 23\\nStep 1: Mid=16 (Go Right) | Step 2: Mid=56 (Go Left) | Step 3: Mid=23 (MATCH!)\\nIndex: 5 | Complexity: O(log N)`;
        } else if (choice === 'fibonacci_dp') {
          algoOutput.innerHTML = `[DYNAMIC PROGRAMMING FIBONACCI]\\nComputing Fib(45) using Bottom-Up Memoized Array:\\nResult: 1,134,903,170\\nOperations: 45 iterations (Zero recursion stack overflow!)\\nComplexity: O(N) Space & Time`;
        } else if (choice === 'two_sum') {
          algoOutput.innerHTML = `[TWO-SUM HASH MAP]\\nArray: [2, 7, 11, 15], Target: 9\\nHash Map State: {2: 0} -> Complement 7 found at index 1!\\nIndices: [0, 1] | Time: O(N), Space: O(N)`;
        }
        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      }, 250);
    });
  }

  // ==========================================
  // 14. IN-CARD ATM LIVE SIMULATOR
  // ==========================================
  let currentAtmBalance = 24500;
  const atmScreenText = document.getElementById('atm-screen-text');
  const atmBtns = document.querySelectorAll('.atm-action-btn');

  atmBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (!atmScreenText) return;

      if (action === 'check') {
        atmScreenText.innerHTML = `ACCOUNT: #SVIET-9934<br>CURRENT BALANCE: $${currentAtmBalance.toLocaleString()}.00 USD<br>STATUS: ACTIVE & SECURE`;
      } else if (action === 'deposit') {
        currentAtmBalance += 1000;
        atmScreenText.innerHTML = `DEPOSIT SUCCESSFUL: +$1,000.00<br>NEW BALANCE: $${currentAtmBalance.toLocaleString()}.00 USD<br>TRANSACTION: #TX-${Math.floor(Math.random()*90000+10000)}`;
      } else if (action === 'withdraw') {
        if (currentAtmBalance >= 500) {
          currentAtmBalance -= 500;
          atmScreenText.innerHTML = `WITHDRAWAL DISPENSED: -$500.00<br>REMAINING: $${currentAtmBalance.toLocaleString()}.00 USD<br>TRANSACTION: #TX-${Math.floor(Math.random()*90000+10000)}`;
        } else {
          atmScreenText.innerHTML = `ERROR: INSUFFICIENT FUNDS<br>BALANCE: $${currentAtmBalance.toLocaleString()}.00 USD`;
        }
      } else if (action === 'statement') {
        atmScreenText.innerHTML = `RECENT LEDGER ENTRIES:<br>• DEP: +$1,000.00 (ATM)<br>• WTH: -$500.00 (POS)<br>BAL: $${currentAtmBalance.toLocaleString()}.00 USD`;
      }

      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  });

  // ==========================================
  // 10. CONTACT FORM DISPATCH & TOAST
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm && formToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      // Store in LocalStorage for demonstration & persistency
      const submissions = JSON.parse(localStorage.getItem('aakash_portfolio_messages') || '[]');
      submissions.push({
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('aakash_portfolio_messages', JSON.stringify(submissions));

      // Visual feedback
      formToast.innerHTML = `<span>⚡</span> <span>Transmission successful! Thank you <strong>${escapeHTML(name)}</strong>. Aakash has logged your message.</span>`;
      formToast.classList.remove('hidden');

      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }

      contactForm.reset();

      setTimeout(() => {
        formToast.classList.add('hidden');
      }, 6000);
    });
  }

  // ==========================================
  // PROJECTS FILTER & QUICK LAUNCHER BAR
  // ==========================================
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (projectFilterBtns.length > 0) {
    projectFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const type = card.getAttribute('data-project-type');
          if (filter === 'all' || type === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // ==========================================
  // RETAIL SALES SQL INTERACTIVE WORKBENCH
  // ==========================================
  const retailSqlChips = document.querySelectorAll('.sql-tab-chip');
  const retailSqlCode = document.getElementById('retail-sql-code');
  const retailSqlTable = document.getElementById('retail-sql-table');

  const retailQueries = {
    top_customers: {
      code: `-- Top 5 Customers by Lifetime Spend
SELECT 
    customer_id,
    COUNT(transactions_id) AS total_orders,
    SUM(total_sale) AS total_spend
FROM retail_sales
GROUP BY customer_id
ORDER BY total_spend DESC
LIMIT 5;`,
      headers: ['customer_id', 'total_orders', 'total_spend', 'segment'],
      rows: [
        ['CUST_1084', '42 orders', '<strong style="color: #ff7043;">₹1,84,200</strong>', '<span class="status-pill vip">VIP / Platinum</span>'],
        ['CUST_0921', '38 orders', '<strong style="color: #ff7043;">₹1,56,800</strong>', '<span class="status-pill vip">VIP / Platinum</span>'],
        ['CUST_1402', '31 orders', '<strong style="color: #ff7043;">₹1,42,150</strong>', '<span class="status-pill high">High Value</span>'],
        ['CUST_0633', '29 orders', '<strong style="color: #ff7043;">₹1,28,900</strong>', '<span class="status-pill high">High Value</span>'],
        ['CUST_1190', '27 orders', '<strong style="color: #ff7043;">₹1,19,450</strong>', '<span class="status-pill high">High Value</span>']
      ]
    },
    hourly_shifts: {
      code: `-- Hourly Shift Velocity & Peak Sales Traffic
WITH hourly_sales AS (
    SELECT *,
        CASE 
            WHEN EXTRACT(HOUR FROM sale_time) < 12 THEN 'Morning Shift (08:00 - 12:00)'
            WHEN EXTRACT(HOUR FROM sale_time) BETWEEN 12 AND 17 THEN 'Afternoon Shift (12:00 - 17:00)'
            ELSE 'Evening Peak (17:00 - 22:00)'
        END AS shift_name
    FROM retail_sales
)
SELECT 
    shift_name,
    COUNT(*) AS total_transactions,
    ROUND(SUM(total_sale), 2) AS total_revenue
FROM hourly_shifts
GROUP BY shift_name
ORDER BY total_revenue DESC;`,
      headers: ['shift_name', 'total_transactions', 'total_revenue', 'velocity_share'],
      rows: [
        ['Evening Peak (17:00 - 22:00)', '1,420 orders', '<strong style="color: #ff7043;">₹8,42,100</strong>', '<span class="status-pill vip">54.2% Peak Surge</span>'],
        ['Afternoon Shift (12:00 - 17:00)', '890 orders', '<strong style="color: #ff7043;">₹4,78,350</strong>', '<span class="status-pill high">30.8% Steady</span>'],
        ['Morning Shift (08:00 - 12:00)', '430 orders', '<strong style="color: #ff7043;">₹2,32,900</strong>', '<span class="status-pill">15.0% Moderate</span>']
      ]
    },
    category_demographics: {
      code: `-- Category Profitability & Age Demographics
SELECT 
    category,
    gender,
    ROUND(AVG(age), 1) AS avg_customer_age,
    SUM(quantiy) AS units_sold,
    ROUND(SUM(total_sale), 2) AS category_revenue
FROM retail_sales
GROUP BY category, gender
ORDER BY category_revenue DESC;`,
      headers: ['category', 'gender', 'avg_customer_age', 'category_revenue'],
      rows: [
        ['Electronics & Tech', 'Male', '28.4 yrs', '<strong style="color: #ff7043;">₹12,85,000</strong>'],
        ['Fashion & Apparel', 'Female', '26.1 yrs', '<strong style="color: #ff7043;">₹7,64,200</strong>'],
        ['Beauty & Personal Care', 'Female', '24.8 yrs', '<strong style="color: #ff7043;">₹5,12,800</strong>'],
        ['Home & Lifestyle', 'Male', '34.2 yrs', '<strong style="color: #ff7043;">₹3,94,500</strong>']
      ]
    }
  };

  if (retailSqlChips.length > 0 && retailSqlCode && retailSqlTable) {
    retailSqlChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        retailSqlChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-query');
        const q = retailQueries[key];
        if (!q) return;

        retailSqlCode.innerHTML = `<code>${escapeHTML(q.code)}</code>`;

        let headerHtml = '<tr>' + q.headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        let bodyHtml = q.rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');

        retailSqlTable.innerHTML = `<thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody>`;

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // ==========================================
  // ZEPTO QUICK-COMMERCE CONSOLE
  // ==========================================
  const zeptoChips = document.querySelectorAll('.zepto-tab-chip');
  const zeptoTime = document.getElementById('zepto-kpi-time');
  const zeptoVolume = document.getElementById('zepto-kpi-volume');
  const zeptoStock = document.getElementById('zepto-kpi-stock');
  const zeptoSqlCode = document.getElementById('zepto-sql-code');

  const zeptoMetrics = {
    sla: {
      time: "8 min 42 sec",
      timeSub: "✓ Within 10-min SLA (96.4% compliance)",
      timeColor: "#ff7043",
      volume: "4,820 orders/day",
      volumeSub: "Peak Surge: 8 PM - 10:30 PM",
      stock: "99.1% In-Stock",
      stockSub: "Automated Reorder Trigger: < 15 units",
      stockColor: "#fbbf24",
      code: `-- 10-Minute SLA Compliance Check Across Dark Store Hubs
SELECT 
    hub_id,
    hub_location,
    ROUND(AVG(delivery_time_mins), 2) AS avg_delivery_time,
    ROUND(SUM(CASE WHEN delivery_time_mins <= 10.0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS sla_compliance_pct
FROM zepto_orders
GROUP BY hub_id, hub_location
HAVING COUNT(*) > 100
ORDER BY sla_compliance_pct DESC;`
    },
    stockout: {
      time: "14 Critical SKUs",
      timeSub: "⚠️ Lead Time: 24 mins to warehouse replenish",
      timeColor: "#ef4444",
      volume: "18.4 units/hr",
      volumeSub: "Highest Burn: Amul Gold Milk & Bread",
      stock: "94.2% In-Stock",
      stockSub: "Reorder Trigger Active for 6 Hubs",
      stockColor: "#f59e0b",
      code: `-- High-Velocity SKU Depletion & Immediate Reorder Trigger
SELECT 
    sku_id,
    product_name,
    current_inventory,
    hourly_consumption_rate,
    ROUND(current_inventory / NULLIF(hourly_consumption_rate, 0), 1) AS hours_left
FROM darkstore_sku_inventory
WHERE current_inventory <= 20
ORDER BY hours_left ASC;`
    },
    rider: {
      time: "142 Active Riders",
      timeSub: "✓ 98.8% Rider Utilization Rate",
      timeColor: "#10b981",
      volume: "6.2 min Transit",
      volumeSub: "Avg 3.2 km Round-Trip Radius",
      stock: "₹18 Surge Bonus",
      stockSub: "Rain & Peak Traffic Incentive Active",
      stockColor: "#ff7043",
      code: `-- Rider Dispatch Velocity & Geofence Efficiency
SELECT 
    rider_id,
    COUNT(order_id) AS total_deliveries,
    ROUND(AVG(transit_time_mins), 2) AS avg_transit_mins,
    ROUND(SUM(distance_km), 2) AS total_km_covered
FROM rider_trip_logs
WHERE trip_date = CURRENT_DATE
GROUP BY rider_id
ORDER BY total_deliveries DESC
LIMIT 5;`
    }
  };

  if (zeptoChips.length > 0 && zeptoTime && zeptoVolume && zeptoStock && zeptoSqlCode) {
    zeptoChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        zeptoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-metric');
        const m = zeptoMetrics[key];
        if (!m) return;

        zeptoTime.textContent = m.time;
        zeptoTime.style.color = m.timeColor;
        const sub1 = zeptoTime.parentElement.querySelector('.kpi-sub');
        if (sub1) sub1.textContent = m.timeSub;

        zeptoVolume.textContent = m.volume;
        const sub2 = zeptoVolume.parentElement.querySelector('.kpi-sub');
        if (sub2) sub2.textContent = m.volumeSub;

        zeptoStock.textContent = m.stock;
        zeptoStock.style.color = m.stockColor;
        const sub3 = zeptoStock.parentElement.querySelector('.kpi-sub');
        if (sub3) sub3.textContent = m.stockSub;

        zeptoSqlCode.innerHTML = `<code>${escapeHTML(m.code)}</code>`;

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // ==========================================
  // BOOKSTORE SQL CONSOLE
  // ==========================================
  const bookstoreChips = document.querySelectorAll('.bookstore-tab-chip');
  const bookstoreSqlCode = document.getElementById('bookstore-sql-code');
  const bookstoreSqlTable = document.getElementById('bookstore-sql-table');

  const bookstoreQueries = {
    royalties: {
      code: `-- Author Royalty Calculation (15% Royalty Split on Gross Sales)
SELECT 
    b.author_name,
    COUNT(o.order_id) AS units_sold,
    SUM(o.quantity * b.unit_price) AS gross_sales,
    ROUND(SUM(o.quantity * b.unit_price) * 0.15, 2) AS author_net_royalty
FROM books b
JOIN order_items o ON b.book_id = o.book_id
GROUP BY b.author_name
ORDER BY gross_sales DESC
LIMIT 4;`,
      headers: ['author_name', 'units_sold', 'gross_sales', 'author_net_royalty'],
      rows: [
        ['Amish Tripathi', '1,240 units', '₹6,20,000', '<strong style="color: #ff7043;">₹93,000</strong>'],
        ['Arundhati Roy', '980 units', '₹4,90,000', '<strong style="color: #ff7043;">₹73,500</strong>'],
        ['Ruskin Bond', '840 units', '₹3,36,000', '<strong style="color: #ff7043;">₹50,400</strong>']
      ]
    },
    genres: {
      code: `-- Top Performing Genres & Margin Analysis
SELECT 
    b.genre,
    COUNT(DISTINCT b.book_id) AS title_count,
    SUM(o.quantity) AS total_copies_sold,
    ROUND(SUM(o.quantity * b.unit_price), 2) AS gross_genre_revenue
FROM books b
JOIN order_items o ON b.book_id = o.book_id
GROUP BY b.genre
ORDER BY gross_genre_revenue DESC;`,
      headers: ['genre', 'title_count', 'total_copies_sold', 'gross_genre_revenue'],
      rows: [
        ['Indian Mythology & Epics', '48 titles', '8,420 copies', '<strong style="color: #ff7043;">₹33,68,000</strong>'],
        ['Literary Fiction & Drama', '32 titles', '5,140 copies', '<strong style="color: #ff7043;">₹25,70,000</strong>'],
        ['Non-Fiction & History', '24 titles', '4,210 copies', '<strong style="color: #ff7043;">₹18,94,500</strong>']
      ]
    },
    reorder: {
      code: `-- Inventory Reorder Triggers (Stock below Reorder Threshold)
SELECT 
    book_id,
    title,
    author_name,
    stock_quantity,
    reorder_level
FROM books
WHERE stock_quantity <= reorder_level
ORDER BY stock_quantity ASC;`,
      headers: ['book_id', 'title', 'stock_quantity', 'reorder_status'],
      rows: [
        ['BK-108', 'The Immortals of Meluha', '<span style="color:#ef4444; font-weight:700;">3 units</span>', '<span class="status-pill" style="border-color:#ef4444; color:#ef4444;">🚨 REORDER NOW</span>'],
        ['BK-244', 'The God of Small Things', '<span style="color:#f59e0b; font-weight:700;">7 units</span>', '<span class="status-pill" style="border-color:#f59e0b; color:#f59e0b;">⚠️ LOW STOCK</span>'],
        ['BK-319', 'The Room on the Roof', '<span style="color:#f59e0b; font-weight:700;">11 units</span>', '<span class="status-pill" style="border-color:#f59e0b; color:#f59e0b;">⚠️ LOW STOCK</span>']
      ]
    }
  };

  if (bookstoreChips.length > 0 && bookstoreSqlCode && bookstoreSqlTable) {
    bookstoreChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        bookstoreChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-bquery');
        const q = bookstoreQueries[key];
        if (!q) return;

        bookstoreSqlCode.innerHTML = `<code>${escapeHTML(q.code)}</code>`;

        let headerHtml = '<tr>' + q.headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        let bodyHtml = q.rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');

        bookstoreSqlTable.innerHTML = `<thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody>`;

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // ==========================================
  // SCROLL TO TOP BUTTON
  // ==========================================
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
