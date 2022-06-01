let data = [
    {
        "testName": "Second test",
        "count": 19,
        "avgProc": 80,
        "questionStatistics": [
            {"count": 3, "avgProc": 100},
            {"count": 10, "avgProc": 90},
            {"count": 10, "avgProc": 60},
            {"count": 10, "avgProc": 70},
            {"count": 19, "avgProc": 84}
        ]
    },
    {
        "testName": "ThirdNameTest",
        "count": 0,
        "avgProc": 0,
        "questionStatistics": []
    }]

const themeSelect = document.getElementById('themeSelect');
const resultTableBody = document.getElementById('resultTableBody');
const dataContainer = document.getElementById('dataContainer');
// const sortTestsButton = document.getElementById('sortTestsButton');
let isReverseTest = false;
const baseUrl = "http:localhost:8080";

function updateResult(data) {
    if (!data) {
        return
    }

    // TODO
    // remove all debug output
    console.log(isReverseTest)

    // TODO:
    // move this string below to separate function
    const reversedData = isReverseTest ? [...data].reverse() : [...data];
    dataContainer.classList.add('active');
    resultTableBody.innerHTML = `
    ${reversedData.map(({testName, count, avgProc}, index) => {
        return `
      <div class="container test" data-id="${index}">
        <div class="row result-row" href='#test${index}'>
          <div class="col-1 text-start d-none d-md-block">${index + 1}</div>
          <div class="col-md-8 col-sm-7 text-start">${testName}</div>
          <div class="col-md-3 col-sm-5 text-center d-flex justify-content-between">
              <div style="width: 40px;">${count}</div>
              <div style="width: 100px;">${avgProc}%</div>
          </div> 
        </div>
      </div>
      `
    }).join('')}
  `
}

// TODO: add separate function to send GET requests
themeSelect.addEventListener('change', async ({target}) => {
    dataContainer.classList.remove('active');
    try {
        const userId = target.value;
        const url = new URL(baseUrl + "/admin/get-users-statistic");
        const params = {id: userId};
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url.toString());
        const result = await response.json();
        updateResult(result);
    } catch (err) {
        console.error(err)
    }
});

function reverseTests(target) {
    target.closest('#sortTestsButton').classList.toggle('reverse');
    const reversedTests = Array.from(resultTableBody.querySelectorAll('.test')).reverse();
    resultTableBody.innerHTML = '';
    reversedTests.forEach(test => {
        resultTableBody.append(test);
    })
}


dataContainer.addEventListener('click', (event) => {
    const {target} = event;
    if (target.closest('#sortTestsButton')) {
        isReverseTest = !isReverseTest;
        reverseTests(target);
    }
})
  