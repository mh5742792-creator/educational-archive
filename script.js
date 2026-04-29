const lessons = [
    { title: "الاتجاهات الواقعية في الأدب", type: "ملزمة PDF", date: "2026-04-15" },
    { title: "التحليل الحركي للسباحة", type: "عرض تفاعلي", date: "2026-04-20" },
    { title: "قواعد اللغة العربية للمتقدمين", type: "اختبار إلكتروني", date: "2026-04-25" }
];

function renderLessons(filter = "") {
    const grid = document.getElementById('lessonsGrid');
    grid.innerHTML = "";

    lessons.filter(l => l.title.includes(filter)).forEach(lesson => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${lesson.title}</h3>
            <p>النوع: ${lesson.type}</p>
            <small>تاريخ النشر: ${lesson.date}</small>
        `;
        grid.appendChild(card);
    });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    renderLessons(e.target.value);
});

// التشغيل الأولي
renderLessons();
