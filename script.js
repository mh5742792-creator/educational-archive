// ضع رابط تطبيق الويب الخاص بجوجل هنا بين علامتي التنصيص
const API_URL = "https://script.google.com/macros/s/AKfycbxxq6Rn9NFqzQBU_iEU3Bnh2kw6_rDuIZfKMS_R3ntZnuCH8GF1yXgqUzQnzEXxEo-i/exec";

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const progressBar = document.getElementById('progressBar');
const percentageText = document.getElementById('percentage');
const statusMessage = document.getElementById('statusMessage');
const resultBox = document.getElementById('resultBox');
const finalLink = document.getElementById('finalLink');

let isSearching = false;

// دالة البحث المتكررة
async function fetchSearchStatus() {
    if (!isSearching) return;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === "searching") {
            // تحديث شريط التحميل والنسبة
            progressBar.style.width = data.progress + "%";
            percentageText.innerText = data.progress + "%";
            statusMessage.innerText = `تم فحص ${data.currentIndex} من أصل ${data.total} احتمال...`;
            
            // طلب دورة جديدة بعد ثانية واحدة لمنع الضغط على الخادم
            setTimeout(fetchSearchStatus, 1000);
            
        } else if (data.status === "found") {
            isSearching = false;
            progressBar.style.width = "100%";
            progressBar.style.backgroundColor = "var(--success)";
            percentageText.innerText = "100%";
            statusMessage.innerText = "اكتشاف ناجح!";
            
            finalLink.href = data.link;
            finalLink.innerText = data.link;
            resultBox.classList.remove('hidden');
            startBtn.disabled = false;
            
        } else if (data.status === "finished") {
            isSearching = false;
            progressBar.style.width = "100%";
            percentageText.innerText = "100%";
            statusMessage.innerText = data.message;
            startBtn.disabled = false;
        }

    } catch (error) {
        console.error("خطأ في الاتصال:", error);
        statusMessage.innerText = "حدث خطأ في الاتصال، جاري المحاولة مجدداً...";
        setTimeout(fetchSearchStatus, 3000);
    }
}

// زر البدء
startBtn.addEventListener('click', () => {
    isSearching = true;
    startBtn.disabled = true;
    resultBox.classList.add('hidden');
    statusMessage.innerText = "بدء تهيئة الخادم وإرسال الطلبات...";
    progressBar.style.backgroundColor = "var(--primary)";
    fetchSearchStatus();
});

// زر التصفير
resetBtn.addEventListener('click', async () => {
    isSearching = false;
    startBtn.disabled = true;
    statusMessage.innerText = "جاري تصفير الخادم...";
    
    try {
        await fetch(API_URL + "?action=reset");
        progressBar.style.width = "0%";
        percentageText.innerText = "0%";
        statusMessage.innerText = "تم التصفير بنجاح. مستعد للبدء.";
        resultBox.classList.add('hidden');
    } catch (err) {
        statusMessage.innerText = "فشل في التصفير.";
    }
    
    startBtn.disabled = false;
});
