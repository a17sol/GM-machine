const COUNTER_BOX_CODE = "counter box code";
const TIMER_BOX_CODE = "timer box code";
const SUMMARY_BOX_CODE = "summary box code"
const COUNTER_X = 435;
const COUNTER_Y = 125;
const TIMER_X = 415;
const TIMER_Y = 125;

function onOpen(event) {
    SlidesApp.getUi().createAddonMenu()
        .addItem('Open panel', 'showSidebar')
        .addToUi();
}

function onInstall(event) {
    onOpen(event);
}

function showSidebar() {
    var summaryArray = Array();
    for (const page of SlidesApp.getActivePresentation().getSlides()) {
        for (const elem of page.getPageElements()) {
            if (elem.getTitle() === SUMMARY_BOX_CODE) {
                const summary = elem.asShape().getText().asString();
                for (const record of summary.split("\n")) {
                    summaryArray.push(record.split(" - "));
                }
            }
        }
    }
    summaryArray.pop();
    const SUMMARY = summaryArray;

    const ui = HtmlService
        .createHtmlOutputFromFile('sidebar')
        .setTitle('Control panel');
    SlidesApp.getUi().showSidebar(ui);
}

function addCounter(name, count) {
    var currentPage = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
    var box = currentPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, COUNTER_X, COUNTER_Y, 210, 65);
    box.getBorder().setWeight(1);
    var title = currentPage.insertTextBox(name, COUNTER_X, COUNTER_Y, 140, 65);
    title.getText().getTextStyle().setFontSize(21);
    title.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    title.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    var count = currentPage.insertTextBox(count, COUNTER_X+140, COUNTER_Y, 70, 65);
    count.getText().getTextStyle().setFontSize(26);
    count.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    count.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    count.setTitle(COUNTER_BOX_CODE);
    currentPage.group([box, title, count]);
}

function addTimer(name) {
    var currentPage = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
    var box = currentPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, TIMER_X, TIMER_Y, 250, 65);
    box.getBorder().setWeight(1);
    var title = currentPage.insertTextBox(name, TIMER_X, TIMER_Y, 140, 65);
    title.getText().getTextStyle().setFontSize(21);
    title.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    title.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    var time = currentPage.insertTextBox("00:00", TIMER_X+140, TIMER_Y, 110, 65);
    time.getText().getTextStyle().setFontSize(26);
    time.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    time.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    time.setTitle(TIMER_BOX_CODE);
    currentPage.group([box, title, time]);
}

function updateTimerText() {
    var presentation = SlidesApp.getActivePresentation();
    for (const k of presentation.getSlides()) {
        for (const i of k.getPageElements()) {
            if (i.getPageElementType() === SlidesApp.PageElementType.GROUP) {
                for (const j of i.asGroup().getChildren()) {
                    if (j.getTitle() === TIMER_BOX_CODE) {
                        var prevTime = j.asShape().getText().asString();
                        var h = Number(prevTime.substr(0, 2));
                        var m = Number(prevTime.substr(3, 2));
                        m = m + 1;
                        if (m === 60) {
                            m = 0;
                            h = h + 1;
                        }
                        h = addZero(h);
                        m = addZero(m);
                        j.asShape().getText().setText(h+":"+m);
                    }
                }
            }
        }
    }
}

function addZero(n) {
    if (n < 10) {
        return '0' + n
    } else {
        return n
    }
}

function stepVisible() {
    var currentPage = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
    stepOnPage(currentPage);
}

function stepAll() {
    var presentation = SlidesApp.getActivePresentation();
    for (const i of presentation.getSlides()) {
        stepOnPage(i);
    }
}

function stepOnPage(page) {
    for (const i of page.getPageElements()) {
        if (i.getPageElementType() === SlidesApp.PageElementType.GROUP) {
            for (const j of i.asGroup().getChildren()) {
                if (j.getTitle() === COUNTER_BOX_CODE) {
                    j.asShape().getText()
                        .setText(Number(j.asShape().getText().asString())-1);
                    if (j.asShape().getText().asString() === "0\n") {
                        i.asGroup().remove();
                    }
                }
            }
        }
    }
}
