// Nepali Calendar Data and Utilities
class NepaliCalendar {
    constructor() {
        // Nepali months in Devanagari
        this.nepaliMonths = [
            'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
            'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
        ];
        
        // English months
        this.englishMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Nepali weekdays
        this.nepaliWeekdays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
        
        // English weekdays
        this.englishWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Nepali numerals
        this.nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        
        // Current date tracking
        this.currentDate = new Date();
        this.currentNepaliYear = 2081;
        this.currentNepaliMonth = 7; // Mansir (0-indexed)
        this.currentNepaliDay = 11;
        
        // Sample calendar data - In a real app, this would come from an API
        this.calendarData = this.generateCalendarData();
        
        // Initialize the application
        this.init();
    }
    
    // Convert English numerals to Nepali
    toNepaliNumber(num) {
        return num.toString().split('').map(digit => this.nepaliNumerals[parseInt(digit)]).join('');
    }
    
    // Generate sample calendar data
    generateCalendarData() {
        const data = {};
        const currentYear = this.currentNepaliYear;
        const currentMonth = this.currentNepaliMonth;
        
        // Generate days for current month
        for (let day = 1; day <= 30; day++) {
            const dateKey = `${currentYear}-${currentMonth}-${day}`;
            data[dateKey] = {
                nepaliDate: day,
                englishDate: this.getCorrespondingEnglishDate(currentYear, currentMonth, day),
                tithi: this.getTithi(day),
                events: this.getEventsForDay(day),
                isToday: day === this.currentNepaliDay
            };
        }
        
        return data;
    }
    
    // Get corresponding English date (simplified conversion)
    getCorrespondingEnglishDate(nepaliYear, nepaliMonth, nepaliDay) {
        // This is a simplified conversion - in reality, you'd need proper conversion algorithms
        const baseDate = new Date(2024, 10, 15); // Base reference date
        const daysDiff = nepaliDay - this.currentNepaliDay;
        const englishDate = new Date(baseDate.getTime() + daysDiff * 24 * 60 * 60 * 1000);
        return englishDate;
    }
    
    // Get Tithi for a given day (simplified)
    getTithi(day) {
        const tithis = [
            'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी',
            'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'औंसी/पूर्णिमा'
        ];
        const paksha = day <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
        const tithiIndex = day <= 15 ? day - 1 : day - 16;
        return `${paksha} ${tithis[tithiIndex] || tithis[0]}`;
    }
    
    // Get events for a specific day
    getEventsForDay(day) {
        const events = {
            1: ['कल्याण काल'],
            5: ['पञ्चमी व्रत'],
            11: ['एकादशी व्रत'],
            15: ['पूर्णिमा'],
            30: ['औंसी']
        };
        return events[day] || [];
    }
    
    // Initialize the application
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.generateCalendar();
        this.setupTabNavigation();
        this.setupZodiacCards();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));
        
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }
    
    // Update date and time display
    updateDateTime() {
        const now = new Date();
        
        // Update current time
        const timeString = now.toLocaleTimeString('ne-NP', { 
            hour12: false,
            timeZone: 'Asia/Kathmandu'
        });
        document.getElementById('currentTime').textContent = this.convertToNepaliTime(timeString);
        
        // Update header dates
        document.getElementById('nepaliDate').textContent = `${this.toNepaliNumber(this.currentNepaliYear)} साल`;
        document.getElementById('englishDate').textContent = `${now.getFullYear()} AD`;
        
        // Update today's info
        document.getElementById('todayNepali').textContent = 
            `${this.toNepaliNumber(this.currentNepaliYear)}/${this.toNepaliNumber(this.currentNepaliMonth + 1).padStart(2, '०')}/${this.toNepaliNumber(this.currentNepaliDay).padStart(2, '०')}`;
        
        document.getElementById('todayEnglish').textContent = now.toLocaleDateString('en-US');
        document.getElementById('tithi').textContent = this.getTithi(this.currentNepaliDay);
        document.getElementById('weekday').textContent = this.nepaliWeekdays[now.getDay()];
    }
    
    // Convert time to Nepali numerals
    convertToNepaliTime(timeString) {
        return timeString.split('').map(char => {
            if (char >= '0' && char <= '9') {
                return this.nepaliNumerals[parseInt(char)];
            }
            return char;
        }).join('');
    }
    
    // Navigate between months
    navigateMonth(direction) {
        this.currentNepaliMonth += direction;
        
        if (this.currentNepaliMonth > 11) {
            this.currentNepaliMonth = 0;
            this.currentNepaliYear++;
        } else if (this.currentNepaliMonth < 0) {
            this.currentNepaliMonth = 11;
            this.currentNepaliYear--;
        }
        
        this.generateCalendar();
        this.updateMonthDisplay();
    }
    
    // Update month display
    updateMonthDisplay() {
        const nepaliMonth = this.nepaliMonths[this.currentNepaliMonth];
        const nepaliYear = this.toNepaliNumber(this.currentNepaliYear);
        document.getElementById('currentMonth').textContent = `${nepaliMonth} ${nepaliYear}`;
        
        // Approximate English month
        const englishDate = this.getCorrespondingEnglishDate(this.currentNepaliYear, this.currentNepaliMonth, 15);
        document.getElementById('currentMonthEng').textContent = 
            `${this.englishMonths[englishDate.getMonth()]} ${englishDate.getFullYear()}`;
    }
    
    // Generate calendar grid
    generateCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        // Create days for the month (simplified - assuming 30 days per month)
        const daysInMonth = 30;
        const startDay = 1; // Simplified - would need proper calculation
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Check if it's today
            if (day === this.currentNepaliDay && this.currentNepaliMonth === 7) {
                dayElement.classList.add('today');
            }
            
            // Check for festivals
            if (this.getEventsForDay(day).length > 0) {
                dayElement.classList.add('festival');
            }
            
            dayElement.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-nepali">${this.toNepaliNumber(day)}</div>
                ${this.getEventsForDay(day).map(event => 
                    `<div class="day-event">${event}</div>`
                ).join('')}
            `;
            
            calendarDays.appendChild(dayElement);
        }
        
        this.updateMonthDisplay();
    }
    
    // Setup tab navigation
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    // Switch to specific tab
    switchTab(tabName) {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.classList.add('active');
        }
    }
    
    // Setup zodiac cards
    setupZodiacCards() {
        const zodiacCards = document.querySelectorAll('.zodiac-card');
        const horoscopeDetail = document.getElementById('horoscopeDetail');
        const selectedSign = document.getElementById('selectedSign');
        const horoscopeText = document.getElementById('horoscopeText');
        
        // Horoscope texts for each zodiac sign
        const horoscopeTexts = {
            aries: 'मेष राशिका जातकहरूको लागि आज धेरै राम्रो दिन हुनेछ। काम र व्यवसायमा सफलता प्राप्त हुनेछ।',
            taurus: 'वृष राशिका जातकहरूले आज धैर्य राख्नुपर्नेछ। स्वास्थ्यमा केही समस्या आउन सक्छ।',
            gemini: 'मिथुन राशिका जातकहरूको लागि आज मिश्रित फल छ। नयाँ अवसरहरू प्राप्त हुनेछ।',
            cancer: 'कर्कट राशिका जातकहरूको लागि आज शुभ दिन हो। पारिवारिक खुशी प्राप्त हुनेछ।',
            leo: 'सिंह राशिका जातकहरूले आज आफ्नो स्वास्थ्यमा ध्यान दिनुपर्छ। काममा सफलता मिल्नेछ।',
            virgo: 'कन्या राशिका जातकहरूको लागि आज राम्रो दिन छ। आर्थिक लाभ हुने सम्भावना छ।',
            libra: 'तुला राशिका जातकहरूले आज सामाजिक कार्यमा सक्रिय भएर फाइदा उठाउन सक्छन्।',
            scorpio: 'वृश्चिक राशिका जातकहरूको लागि आज चुनौतीपूर्ण दिन हो। सावधानी अपनाउनुहोस्।',
            sagittarius: 'धनु राशिका जातकहरूको लागि आज शुभ दिन हो। शिक्षा र ज्ञानमा वृद्धि हुनेछ।',
            capricorn: 'मकर राशिका जातकहरूले आज व्यापारमा फाइदा हुने सम्भावना छ। मेहनत सफल हुनेछ।',
            aquarius: 'कुम्भ राशिका जातकहरूको लागि आज मध्यम फल छ। नयाँ मित्रता हुने सम्भावना छ।',
            pisces: 'मीन राशिका जातकहरूको लागि आज शुभ दिन हो। मानसिक शान्ति प्राप्त हुनेछ।'
        };
        
        const signNames = {
            aries: 'मेष राशि',
            taurus: 'वृष राशि',
            gemini: 'मिथुन राशि',
            cancer: 'कर्कट राशि',
            leo: 'सिंह राशि',
            virgo: 'कन्या राशि',
            libra: 'तुला राशि',
            scorpio: 'वृश्चिक राशि',
            sagittarius: 'धनु राशि',
            capricorn: 'मकर राशि',
            aquarius: 'कुम्भ राशि',
            pisces: 'मीन राशि'
        };
        
        zodiacCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                zodiacCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Get the sign data
                const sign = card.dataset.sign;
                
                // Update horoscope detail
                selectedSign.textContent = signNames[sign];
                horoscopeText.textContent = horoscopeTexts[sign];
                horoscopeDetail.style.display = 'block';
                
                // Scroll to horoscope detail
                horoscopeDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }
}

// Sample data for festivals and events
const festivals = [
    {
        nepaliDate: 'मंसिर १५',
        englishDate: 'Dec 1, 2024',
        name: 'बिवाह पञ्चमी',
        description: 'सीता राम विवाहको उत्सव'
    },
    {
        nepaliDate: 'पुष १५',
        englishDate: 'Dec 30, 2024',
        name: 'माघे सङ्क्रान्ति',
        description: 'सूर्यको मकर राशिमा प्रवेश'
    },
    {
        nepaliDate: 'माघ १',
        englishDate: 'Jan 14, 2025',
        name: 'माघे सङ्क्रान्ति',
        description: 'तिल र घिउको दान'
    }
];

// Utility functions
function formatNepaliDate(year, month, day) {
    const nepaliCalendar = new NepaliCalendar();
    return `${nepaliCalendar.toNepaliNumber(year)}/${nepaliCalendar.toNepaliNumber(month + 1).padStart(2, '०')}/${nepaliCalendar.toNepaliNumber(day).padStart(2, '०')}`;
}

function formatEnglishDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NepaliCalendar();
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NepaliCalendar, festivals, formatNepaliDate, formatEnglishDate };
}
