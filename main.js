const COUNTER_BOX_CODE = "counter box";
const TIMER_BOX_CODE = "timer box";
const SUMMARY_BOX_CODE = "summary box"
const COUNTER_X_PLAYER = 435;
const COUNTER_Y_PLAYER = 125;
const TIMER_X_PLAYER = 415;
const TIMER_Y_PLAYER = 125;
const COUNTER_X_GM = 100;
const COUNTER_Y_GM = 100;
const TIMER_X_GM = 100;
const TIMER_Y_GM = 100;

function onOpen(event) {
    SlidesApp.getUi().createAddonMenu()
        .addItem('Open panel', 'showSidebar')
        .addToUi();
}

function onInstall(event) {
    onOpen(event);
}

function showSidebar() {
    index = new Map();
    for (const page of SlidesApp.getActivePresentation().getSlides()) {
        for (const elem of page.getPageElements()) {
            if (elem.getTitle() === SUMMARY_BOX_CODE) {
                const summary = elem.asShape().getText().asString().trim();
                for (const record of summary.split("\n")) {
                    let pair = record.split(" - ");
                    if (pair[0] === "Summary" || pair[0] === "Сводка") {
                        pair[0] = "Summary";
                    }
                    index.set(pair[0], parseInt(pair[1])-1);
                }
            }
        }
    }

    const ui = HtmlService
        .createTemplateFromFile('sidebar')
        .evaluate().setTitle("Панель управления");
    SlidesApp.getUi().showSidebar(ui);
}

function addCounterPair(charName, charPage, sumPage, effect, initCount) {
    addCounter(charName, charPage, false, effect, initCount);
    addCounter(charName, sumPage, true, effect, initCount);
}

function addCounter(charName, page, addingToSummary, effect, initCount) {
    const targetPage = SlidesApp.getActivePresentation()
        .getSlides()[page];
    let x = addingToSummary ? COUNTER_X_GM : COUNTER_X_PLAYER;
    let y = addingToSummary ? COUNTER_Y_GM : COUNTER_Y_PLAYER;
    const box = targetPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, x, y, 210, 65);
    box.getBorder().setWeight(1);
    let title = targetPage.insertTextBox(effect, x, y, 145, 65);
    title.getText().getTextStyle().setFontSize(21);
    if (addingToSummary) {
        title.getText().setText(charName+": "+effect);
        title.getText().getTextStyle().setFontSize(15);
    }
    title.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    title.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    const count = targetPage.insertTextBox(initCount, x + 145, y, 65, 65);
    count.getText().getTextStyle().setFontSize(26);
    count.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    count.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    count.setTitle(COUNTER_BOX_CODE);
    targetPage.group([box, title, count]);
}

function addTimer(name) {
    const currentPage = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
    const box = currentPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, TIMER_X_PLAYER, TIMER_Y_PLAYER, 250, 65);
    box.getBorder().setWeight(1);
    const title = currentPage.insertTextBox(name, TIMER_X_PLAYER, TIMER_Y_PLAYER, 140, 65);
    title.getText().getTextStyle().setFontSize(21);
    title.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    title.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    const time = currentPage.insertTextBox("00:00", TIMER_X_PLAYER + 140, TIMER_Y_PLAYER, 110, 65);
    time.getText().getTextStyle().setFontSize(26);
    time.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    time.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    time.setTitle(TIMER_BOX_CODE);
    currentPage.group([box, title, time]);
}

function updateTimerText() {
    for (const k of SlidesApp.getActivePresentation().getSlides()) {
        for (const i of k.getPageElements()) {
            if (i.getPageElementType() === SlidesApp.PageElementType.GROUP) {
                for (const j of i.asGroup().getChildren()) {
                    if (j.getTitle() === TIMER_BOX_CODE) {
                        const prevTime = j.asShape().getText().asString();
                        let h = Number(prevTime.substr(0, 2));
                        let m = Number(prevTime.substr(3, 2));
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
    stepOnPage(SlidesApp.getActivePresentation().getSelection().getCurrentPage());
}

function stepAll(indexPages) {
    const allSlides = SlidesApp.getActivePresentation().getSlides();
    for (const i of indexPages) {
        stepOnPage(allSlides[i]);
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
