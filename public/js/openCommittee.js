// Komite başlıklarını seç
const committees = document.querySelectorAll('.committee');
const courses = document.querySelectorAll('.courses');
const classNumber = 2; // Sınıf numarasını burada tanımlıyoruz

// Her komite başlığına tıklama olayı ekle
committees.forEach(committee => {
    committee.addEventListener('click', () => {
        const committeeId = committee.getAttribute('data-committee');

        // Önce tüm ders içeriklerini gizle (animasyonlu gizleme)
        const allCourses = document.querySelectorAll('.courses');
        allCourses.forEach(course => {
            course.classList.remove('show'); // Animasyonla gizle
            setTimeout(() => course.classList.add('hidden'), 500); // Yarım saniye sonra tamamen gizle
        });

        // Tıklanan komiteye ait ders içeriklerini göster (animasyonlu gösterme)
        const selectedCourses = document.getElementById(`committee-${committeeId}`);
        setTimeout(() => {
            selectedCourses.classList.remove('hidden'); // İlk olarak göster
            selectedCourses.classList.add('show'); // Ardından animasyonla görünür yap
        }, 500); // Diğer içerikler gizlenirken bekle
    });
});

courses.forEach(courseList => {
    const courseItems = courseList.querySelectorAll('li');

    courseItems.forEach(courseItem => {
        courseItem.addEventListener('click', function () {
            const courseName = this.getAttribute('data-course');
            const committeeId = courseList.getAttribute('id').split('-')[1]; // Komite ID'yi al

            // Fetch ile POST isteği at
            fetch('/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    class: classNumber, // Kaçıncı sınıf
                    committee: committeeId,
                    course: courseName,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Başarı:', data);
                    // Burada gelen verilere göre işlem yapılabilir, yönlendirme yapılabilir.
                })
                .catch((error) => {
                    console.error('Hata:', error);
                });
        });
    });
});