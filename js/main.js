document.addEventListener('DOMContentLoaded', function() {
    initPortfolio();
    
    initScrollAnimations();
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    addGlassEffect();

    initLanguageSwitcher();

    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 800);
});

function initPortfolio() {
    document.querySelector('.profile-name').textContent = config.name;
    document.querySelector('.profile-tagline').textContent = config.tagline;
    document.querySelector('.bio-text').textContent = config.shortBio;
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.src = config.profileImage;
        profileImage.alt = config.name;
    }
    
    const twitchLink = document.getElementById('twitchLink');
    if (twitchLink) twitchLink.href = config.social.twitch.url;
    
    const tiktokLink = document.getElementById('tiktokLink');
    if (tiktokLink) tiktokLink.href = config.social.tiktok.url;
    
    const discordLink = document.getElementById('discordLink');
    if (discordLink) discordLink.href = config.social.discord.inviteUrl;
    
    const spotifyLink = document.getElementById('spotifyLink');
    if (spotifyLink) spotifyLink.href = config.social.spotify.url;
    
    const steamLink = document.getElementById('steamLink');
    if (steamLink) steamLink.href = config.social.steam.url;
    
    const twitchChannelLink = document.getElementById('twitchChannelLink');
    if (twitchChannelLink) twitchChannelLink.href = config.social.twitch.url;
    
    const tiktokChannelLink = document.getElementById('tiktokChannelLink');
    if (tiktokChannelLink) tiktokChannelLink.href = config.social.tiktok.url;
    
    simulateTwitchStatus();
    simulateTikTokStatus();
    
    applyCustomColors();
}

function loadInstagramPhotos() {
    const instagramGrid = document.getElementById('instagramGrid');
    if (!instagramGrid) return;
    
    instagramGrid.innerHTML = '';
    
    const photoElements = [];
    
    config.instagramPhotos.forEach((photoUrl, index) => {
        const photoElement = document.createElement('div');
        photoElement.className = 'instagram-item';
        photoElement.style.opacity = '0';
        
        photoElement.style.backgroundColor = 'rgba(141, 149, 102, 0.1)';
        
        const img = document.createElement('img');
        img.alt = 'Instagram Photo';
        img.className = 'instagram-img';
        img.width = 180;
        img.height = 180;
        
        photoElement.appendChild(img);
        instagramGrid.appendChild(photoElement);
        
        photoElements.push({ element: photoElement, img: img, url: photoUrl });
        
        photoElement.addEventListener('click', function() {
            window.open(config.social.instagram.url, '_blank');
        });
    });
    
    requestAnimationFrame(() => {
        photoElements.forEach((item, index) => {
            setTimeout(() => {
                item.img.src = item.url;
                
                item.img.onload = function() {
                    item.element.style.opacity = '1';
                    item.element.style.transition = 'opacity 0.3s ease';
                };
                
                item.img.onerror = function() {
                    item.element.style.opacity = '1';
                    item.img.style.display = 'none';
                };
            }, index * 100);
        });
    });
}

function loadTikTokPreview() {
    const tiktokContainer = document.getElementById('tiktokContainer');
    if (!tiktokContainer) return;
    
    tiktokContainer.innerHTML = `
        <div class="tiktok-placeholder">
            <img src="images/tiktok-preview.png" alt="TikTok Preview" class="tiktok-preview">
            <div class="tiktok-overlay">
                <i class="fab fa-tiktok tiktok-icon"></i>
            </div>
            <a href="${config.social.tiktok.url}" class="btn-primary" target="_blank">
                <i class="fab fa-tiktok"></i> Follow on TikTok
            </a>
        </div>
    `;
}

function simulateTwitchStatus() {
    const statusIndicator = document.getElementById('twitchStatus');
    const statusText = document.getElementById('statusText');
    const twitchEmbed = document.getElementById('twitchEmbed');
    const twitchOffline = document.getElementById('twitchOffline');
    
    if (!statusIndicator || !statusText || !twitchEmbed || !twitchOffline) return;
    
    const forceOnline = true;
    
    if (forceOnline) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = 'Live Now!';
        twitchEmbed.style.display = 'block';
        twitchOffline.style.display = 'none';
        
        twitchEmbed.innerHTML = `
            <div class="twitch-responsive-embed">
                <iframe
                    src="https://player.twitch.tv/?channel=${config.social.twitch.username}&parent=${window.location.hostname || 'localhost'}"
                    frameborder="0"
                    allowfullscreen="true"
                    scrolling="no"
                    height="100%"
                    width="100%">
                </iframe>
            </div>
        `;
        return;
    }
    
    const twitchUsername = config.social.twitch.username;
    
    fetch(`https://decapi.me/twitch/uptime/${twitchUsername}`)
        .then(response => response.text())
        .then(data => {
            const isLive = !data.includes('offline');
            
            if (isLive) {
                statusIndicator.className = 'status-indicator online';
                statusText.textContent = 'Live Now!';
                twitchEmbed.style.display = 'block';
                twitchOffline.style.display = 'none';
                
                twitchEmbed.innerHTML = `
                    <div class="twitch-responsive-embed">
                        <iframe
                            src="https://player.twitch.tv/?channel=${twitchUsername}&parent=${window.location.hostname || 'localhost'}"
                            frameborder="0"
                            allowfullscreen="true"
                            scrolling="no"
                            height="100%"
                            width="100%">
                        </iframe>
                    </div>
                `;
            } else {
                statusIndicator.className = 'status-indicator offline';
                statusText.textContent = 'Offline';
                twitchEmbed.style.display = 'none';
                twitchOffline.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error checking Twitch status:', error);
            // Default to offline if there's an error
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Status unavailable';
            twitchEmbed.style.display = 'none';
            twitchOffline.style.display = 'block';
        });
}

function simulateTikTokStatus() {
    const statusIndicator = document.getElementById('tiktokStatus');
    const statusText = document.getElementById('tiktokStatusText');
    const tiktokEmbed = document.getElementById('tiktokEmbed');
    const tiktokOffline = document.getElementById('tiktokOffline');
    const tiktokChannelLink = document.getElementById('tiktokChannelLink');
    
    if (!statusIndicator || !statusText || !tiktokEmbed || !tiktokOffline) return;
    
    if (tiktokChannelLink) tiktokChannelLink.href = config.social.tiktok.url;
    
    const forceOnline = true;
    
    if (forceOnline) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = 'Live Now!';
        tiktokEmbed.style.display = 'block';
        tiktokOffline.style.display = 'none';
        
        tiktokEmbed.innerHTML = `
            <div class="tiktok-live-container">
                <div class="tiktok-live-header">
                    <div class="tiktok-live-icon">
                        <i class="fab fa-tiktok"></i>
                    </div>
                    <div class="tiktok-live-info">
                        <h3>@${config.social.tiktok.username}</h3>
                        <div class="tiktok-live-status">
                            <span class="pulse-dot"></span>
                            <span>Live Now</span>
                        </div>
                    </div>
                </div>
                <div class="tiktok-live-content">
                    <div class="tiktok-live-message">
                        <i class="fas fa-broadcast-tower"></i>
                        <p>${config.name} is streaming live on TikTok!</p>
                    </div>
                    <a href="${config.social.tiktok.url}" class="tiktok-watch-button" target="_blank">
                        <i class="fab fa-tiktok"></i> Watch Live Stream
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    const tiktokUsername = config.social.tiktok.username;
    
    fetch(`https://www.streamchecker.net/is-tiktok-user-live?username=${tiktokUsername}`)
        .then(response => response.text())
        .then(html => {
            const isLive = html.includes('is currently live') || 
                           html.includes('is live now') || 
                           html.includes('LIVE');
            
            if (isLive) {
                statusIndicator.className = 'status-indicator online';
                statusText.textContent = 'Live Now!';
                tiktokEmbed.style.display = 'block';
                tiktokOffline.style.display = 'none';
                
                tiktokEmbed.innerHTML = `
                    <div class="tiktok-live-container">
                        <div class="tiktok-live-header">
                            <div class="tiktok-live-icon">
                                <i class="fab fa-tiktok"></i>
                            </div>
                            <div class="tiktok-live-info">
                                <h3>@${tiktokUsername}</h3>
                                <div class="tiktok-live-status">
                                    <span class="pulse-dot"></span>
                                    <span>Live Now</span>
                                </div>
                            </div>
                        </div>
                        <div class="tiktok-live-content">
                            <div class="tiktok-live-message">
                                <i class="fas fa-broadcast-tower"></i>
                                <p>${config.name} is streaming live on TikTok!</p>
                            </div>
                            <a href="${config.social.tiktok.url}" class="tiktok-watch-button" target="_blank">
                                <i class="fab fa-tiktok"></i> Watch Live Stream
                            </a>
                        </div>
                    </div>
                `;
            } else {
                statusIndicator.className = 'status-indicator offline';
                statusText.textContent = 'Offline';
                tiktokEmbed.style.display = 'none';
                tiktokOffline.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error checking TikTok status:', error);
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Live Now!';
            tiktokEmbed.style.display = 'block';
            tiktokOffline.style.display = 'none';
            
            tiktokEmbed.innerHTML = `
                <div class="tiktok-live-container">
                    <div class="tiktok-live-header">
                        <div class="tiktok-live-icon">
                            <i class="fab fa-tiktok"></i>
                        </div>
                        <div class="tiktok-live-info">
                            <h3>@${tiktokUsername}</h3>
                            <div class="tiktok-live-status">
                                <span class="pulse-dot"></span>
                                <span>Live Now</span>
                            </div>
                        </div>
                    </div>
                    <div class="tiktok-live-content">
                        <div class="tiktok-live-message">
                            <i class="fas fa-broadcast-tower"></i>
                            <p>${config.name} is streaming live on TikTok!</p>
                        </div>
                        <a href="${config.social.tiktok.url}" class="tiktok-watch-button" target="_blank">
                            <i class="fab fa-tiktok"></i> Watch Live Stream
                        </a>
                    </div>
                </div>
            `;
        });
}

function applyCustomColors() {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', config.colors.primary);
    root.style.setProperty('--secondary-color', config.colors.secondary);
    root.style.setProperty('--accent-color', config.colors.accent);
    root.style.setProperty('--background-color', config.colors.background);
    root.style.setProperty('--text-color', config.colors.text);
    
    if (config.colors.cardBackground) {
        root.style.setProperty('--card-background', config.colors.cardBackground);
    }
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        icon.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
}

function addGlassEffect() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        if (!sections.length) return;
        
        const scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            if (!section) return;
            
            const sectionTop = section.getBoundingClientRect().top + scrollPosition;
            const distance = Math.abs(scrollPosition - sectionTop);
            
            const opacity = Math.min(0.8, distance / 1000);
            section.style.background = `rgba(17, 34, 64, ${0.8 - opacity})`;
        });
    });
}

function initLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const languageMenu = document.getElementById('languageMenu');
    const languageItems = document.querySelectorAll('.language-menu-item');
    
    if (!langToggle || !languageMenu) return;
    
    langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        languageMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (languageMenu.classList.contains('active') && !languageMenu.contains(e.target)) {
            languageMenu.classList.remove('active');
        }
    });
    
    languageItems.forEach(item => {
        item.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            languageItems.forEach(i => i.classList.remove('active'));
            
            this.classList.add('active');
            
            switchLanguage(lang);
            
            languageMenu.classList.remove('active');
        });
    });
    
    const currentLang = localStorage.getItem('ixpaixLanguage') || 'en';
    switchLanguage(currentLang);
    
    const activeLangItem = document.querySelector(`.language-menu-item[data-lang="${currentLang}"]`);
    if (activeLangItem) {
        languageItems.forEach(i => i.classList.remove('active'));
        activeLangItem.classList.add('active');
    }
}

function switchLanguage(lang) {
    if (!config.translations || !config.translations[lang]) return;
    
    localStorage.setItem('ixpaixLanguage', lang);
    
    const translations = config.translations[lang];
    
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    const welcomeContent = document.querySelector('.welcome-content');
    if (welcomeContent) {
        welcomeContent.innerHTML = `
            <p>${translations.welcomeP1 || ''}</p>
            <p>${translations.welcomeP2 || ''}</p>
            <p>${translations.welcomeP3 || ''}</p>
            <p>${translations.welcomeP4 || ''}</p>
        `;
    }
    
    updateElementContent('.welcome-section .section-title', translations.welcomeTitle);
    updateElementContent('.games-section .section-title', translations.gamesTitle);
    updateElementContent('.twitch-section .section-title', translations.streamTitle);
    updateElementContent('.tiktok-section .section-title', translations.tiktokTitle);
    updateElementContent('.instagram-section .section-title', translations.instagramTitle);
    updateElementContent('.contact-section .section-title', translations.contactTitle);
    updateElementContent('.donation-section .section-title', translations.supportTitle);
    
    updateElementContent('#twitchOffline p', translations.streamOffline);
    updateElementContent('#twitchChannelLink', translations.visitChannel);
    
    updateElementContent('#instagramProfileLink', translations.followInstagram);
    
    updateElementContent('.contact-info h3', translations.contactInfo);
    updateElementContent('.contact-text h4:first-of-type', translations.emailTitle);
    updateElementContent('.contact-text h4:last-of-type', translations.businessTitle);
    updateElementContent('.contact-text p:last-of-type', translations.businessInfo);
    updateElementContent('.contact-platforms h3', translations.bestWays);
    updateElementContent('.platform-link.instagram', translations.instagramDM);
    updateElementContent('.platform-link.email', translations.emailContact);
    
    updateElementContent('.donation-text p', translations.supportText);
    updateElementContent('.donation-cta .btn-primary', translations.supportBtn);
    updateElementContent('.benefit-item:nth-child(1) span', translations.benefitEquipment);
    updateElementContent('.benefit-item:nth-child(2) span', translations.benefitGames);
    updateElementContent('.benefit-item:nth-child(3) span', translations.benefitHappy);
    
    document.querySelector('.footer p').innerHTML = `&copy; <span id="currentYear">${new Date().getFullYear()}</span> IxPaix. ${translations.allRights}`;
    updateElementContent('.footer-link:nth-child(1)', translations.privacy);
    updateElementContent('.footer-link:nth-child(3)', translations.contact);
    updateElementContent('.footer-link:nth-child(5)', translations.terms);
}

function updateElementContent(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
        element.textContent = text;
    }
} 
