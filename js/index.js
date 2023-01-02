//explore button declare
let explore=document.querySelector('.header-items button');
let hadithSection=document.querySelector('.hadith');
// navbar changing background-color on scroll declare
let fixedNav=document.querySelector('header nav');
//sections links declare
let sections=document.querySelectorAll('section');
let links=document.querySelectorAll('header ul li');
//hadith display declare 
let hadith=document.querySelector('.hadith-caption .hadith-title');
let nextBtn =document.querySelector('#next');
let prevBtn =document.querySelector('#previous');
let hadithIndex=0;

let currentHadith=document.querySelector('.number .current-hadith');
let totalNumbers=document.querySelector('.number .total-numbers');
//back top button
let backTop=document.querySelector('.backBtn');
let mainSection=document.querySelector('.main')
let logo=document.querySelector('.logo');
//icon bar responsive
let bar=document.querySelector('header .icon i');
let sideBar=document.querySelector('header ul');
//apis declare
let hadithData,
quranData,
hadithResponse,
quranResponse,
prayResponse,
prayData;
//explore button
explore.addEventListener('click',()=>{
    hadithSection.scrollIntoView({
        behavior:'smooth'
    })
});
logo.addEventListener('click',()=>{
    mainSection.scrollIntoView({
        behavior:'smooth'
    })
});
// navbar changing background-color on scroll
window.addEventListener('scroll',()=>{
    window.scrollY > 150 ? fixedNav.classList.add('active-nav') : fixedNav.classList.remove('active-nav');
    //backtop button display
    window.scrollY>mainSection.offsetTop?backTop.classList.add('active') : backTop.classList.remove('active');
    
});
//links clicked 
links.forEach(link=>{
    link.addEventListener('click',()=>{
        document.querySelector('header ul li.active').classList.remove('active');
        link.classList.add('active');
        let target=link.dataset.filter;
        sections.forEach(section=>{
            if(section.classList.contains(target)){
                section.scrollIntoView({
                    behavior:'smooth'
                })
            }
        })
    })
})
//backtop button clicked
backTop.addEventListener('click',()=>{
    window.scrollTo({
        top:0,
        behavior:'smooth',
    })
})

//HADITH DISPLAY
async function fetchApi(){
    hadithResponse= await fetch(`https://hadis-api-id.vercel.app/hadith/abu-dawud?page=1&limit=20`);
    hadithData= await hadithResponse.json();
    // console.log(hadithData);
    displayHadith();
}
fetchApi();
function displayHadith(){
    hadith.innerText=hadithData.items[hadithIndex].arab;
    currentHadith.innerText=hadithIndex+1;
    totalNumbers.innerText=hadithData.items.length;
}
nextBtn.addEventListener('click',getNextHadith);
function getNextHadith(){
    hadithIndex++;
    if(hadithIndex==hadithData.items.length){
        hadithIndex=0;
    }
    displayHadith();
}
prevBtn.addEventListener('click',getPrevHadith);
function getPrevHadith(){
    hadithIndex--;
    if(hadithIndex<0){
        hadithIndex=hadithData.items.length-1;
    }
    displayHadith();
}
//quran display
async function getQuran(){
    quranResponse=await fetch(`http://api.alquran.cloud/v1/meta`);
    quranData=await quranResponse.json();
    quranData=quranData.data.surahs.references;
    // console.log(quranData);
    displayQuran()
} 
getQuran();
function displayQuran(){
    surahs='';
    for (let i = 0; i < quranData.length; i++) {
        surahs+=`
                    <div class="col-lg-2 col-md-3 col-sm-4 col-6">
                        <div class="quran-content">
                            <p>${quranData[i].name}</p>
                            <p>${quranData[i].englishName}</p>
                        </div>
                    </div>
                    `;
    document.querySelector('#quran-display').innerHTML=surahs; 
    }
    //display popup
   let surahTitle=document.querySelectorAll('.quran-content');
   let popup=document.querySelector('.popup'),
   surahDetails=document.querySelector('.surah-details');
    surahTitle.forEach((title,index)=>{
        title.addEventListener('click',()=>{
        fetch(`http://api.alquran.cloud/v1/surah/${index+1}`).then(response=>response.json()).then(data=>{
            surahDetails.innerHTML='';
            let ayat=data.data.ayahs;
            ayat.forEach(aya=>{
                popup.classList.add('active');
                surahDetails.innerHTML+=`<p>${aya.text}<span>(${aya.numberInSurah})</span></p>`
            })
        })
    })
    //close btn on click
    let closeIcon=document.querySelector('.close-icon');
    closeIcon.addEventListener('click',()=>{
        popup.classList.remove('active');
    })
    //close popup on escape
    document.addEventListener('keydown',function(e){
        if(e.key=='Escape'){
            popup.classList.remove('active');
        }
    }
    )
   })
}
//pray time
getPrayTime();
async function getPrayTime(){
    prayResponse= await fetch(`http://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt`);
    prayData= await prayResponse.json();
    prayData=prayData.data.timings;
    displayPrayTime();
}
function displayPrayTime(){
    prayCard='';
    for (let time in prayData) {
        prayCard+=`
                    <div class="col-lg-3 col-md-6">
                        <div class="pray-card">
                            <div class="circle">
                                <svg >
                                    <circle cx="100" cy="100" r="100"></circle>
                                </svg>
                                <div class="pray-time">${prayData[time]}</div>
                            </div>
                            <p class="pray-title">${time}</p>
                        </div>
                    </div>
                `;
    document.getElementById('pray-display').innerHTML=prayCard;
    }
}
//bars responsive
bar.addEventListener('click',()=>{
    sideBar.classList.toggle('active');
})
