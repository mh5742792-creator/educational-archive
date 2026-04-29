const API_URL = "YOUR_WEB_APP_URL_HERE";

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const progressBar = document.getElementById('progressBar');
const percentageText = document.getElementById('percentageText');
const statusMessage = document.getElementById('statusMessage');
const resultBox = document.getElementById('resultBox');
const finalLink = document.getElementById('finalLink');

// عناصر الأرقام الدقيقة
const totalCountEl = document.getElementById('totalCount');
const checkedCountEl = document.getElementById('checkedCount');
const remainingCountEl = document.getElementById('remainingCount');

let isSearching = false;

// دالة لتنسيق الأرقام الطويلة بفواصل (مثل 1,000,000)
function formatNumber(num) {
    return new Intl.NumberFormat('ar-EG').format(num);
}

// دالة الاتصال بالخادم
async function fetchSearchStatus() {
    if (!isSearching) return;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // تحديث الأرقام الدقيقة في الواجهة
        totalCountEl.innerText = formatNumber(data.total);
        checkedCountEl.innerText = formatNumber(data.currentIndex);
        remainingCountEl.innerText = formatNumber(data.remaining);

        // حساب النسبة المئوية بدقة 3 أرقام عشرية
        let calcProgress = (data.currentIndex / data.total) * 100;
        let formattedProgress = calcProgress.toFixed(3); 
        
        if (data.status === "searching") {
            progressBar.style.width = calcProgress + "%";
            percentageText.innerText = formattedProgress + "%";
            statusMessage.innerText = "جاري الفحص المتقدم في خوادم جوجل...";
            
            // استدعاء فوري للحفاظ على سرعة شريط التحميل
            setTimeout(fetchSearchStatus, 800);
            
        } else if (data.status === "found") {
            isSearching = false;
            progressBar.style.width = "100%";
            progressBar.style.backgroundColor = "var(--success)";
            percentageText.innerText = "100.000%";
            percentageText.style.color = "var(--success)";
            statusMessage.innerText = "تمت المهمة بنجاح!";
            
            finalLink.href = data.link;
            finalLink.innerText = data.link;
            resultBox.classList.remove('hidden');
            startBtn.disabled = false;
            
        } else if (data.status === "finished") {
            isSearching = false;
            progressBar.style.width = "100%";
            percentageText.innerText = "100.000%";
            statusMessage.innerText = "انتهت جميع الاحتمالات الممكنة. الملف محذوف نهائياً.";
            startBtn.disabled = false;
        }

    } catch (error) {
        console.error("خطأ:", error);
        statusMessage.innerText = "محاولة إعادة الاتصال بالخادم...";
        setTimeout(fetchSearchStatus, 3000); // محاولة التخطي في حال تقطع الإنترنت
    }
}

// بدء التشغيل
startBtn.addEventListener('click', () => {
    isSearching = true;
    startBtn.disabled = true;
    resultBox.classList.add('hidden');
    statusMessage.innerText = "جاري إنشاء قناة الاتصال...";
    progressBar.style.backgroundColor = "var(--primary)";
    fetchSearchStatus();
});

// تصفير الخادم
resetBtn.addEventListener('click', async () => {
    isSearching = false;
    startBtn.disabled = true;
    statusMessage.innerText = "جاري مسح ذاكرة الخادم...";
    
    try {
        const res = await fetch(API_URL + "?action=reset");
        const data = await res.json();
        
        totalCountEl.innerText = formatNumber(data.total);
        checkedCountEl.innerText = "0";
        remainingCountEl.innerText = formatNumber(data.total);
        
        progressBar.style.width = "0%";
        percentageText.innerText = "0.000%";
        statusMessage.innerText = "النظام جاهز لبدء دورة فحص جديدة.";
        resultBox.classList.add('hidden');
    } catch (err) {
        statusMessage.innerText = "خطأ أثناء التصفير، تأكد من اتصالك.";
    }
    
    startBtn.disabled = false;
});
