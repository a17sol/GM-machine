const COUNTER_BOX_CODE = "counter box";
const TIMER_BOX_CODE = "timer box";
const CLOCK_BOX_CODE = "clock box";
const SUMMARY_BOX_CODE = "summary box"

const GM_GRID = [[35,80], [35,155], [35,230], [35,305],
    [255,80], [255,155], [255,230], [255,305],
    [475,80], [475,155], [475,230], [475,305]];
const PLAYER_GRID = [[435,95], [435,170], [435,245], [435,320]]

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
                    const pair = record.split(" - ");
                    if (pair[0] === "Summary" || pair[0] === "Master slide") {
                        pair[0] = "Summary";
                    }
                    index.set(pair[0], parseInt(pair[1])-1);
                }
            }
        }
    }

    const ui = HtmlService
        .createTemplateFromFile('sidebar')
        .evaluate().setTitle("Control panel");
    SlidesApp.getUi().showSidebar(ui);
}

function addCounterPair(charName, charPage, sumPage, effect, initCount) {
    if (charPage !== null) {
        addCounter(charName, charPage, false, effect, initCount);
    }
    addCounter(charName, sumPage, true, effect, initCount);
}

function addCounter(charName, page, addingToSummary, effect, initCount) {
    const targetPage = SlidesApp.getActivePresentation()
        .getSlides()[page];
    const xy = freeCoordinates(targetPage, addingToSummary);
    if (xy === undefined) {
        SlidesApp.getUi().alert("No room on the "
            + (addingToSummary ? "Summary" : charName)
            + " slide. No counter has been added to this slide.");
        return;
    }
    const x = xy[0];
    const y = xy[1];
    const box = targetPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, x, y, 210, 65);
    box.getBorder().setWeight(1);
    const title = targetPage.insertTextBox(effect, x, y, 145, 65);
    title.getText().getTextStyle().setFontSize(19);
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

function freeCoordinates(page, summary) {
    function occupied(arr, pair) {
        return arr.some((arrVal) => arrVal.getLeft() === pair[0] && arrVal.getTop() === pair[1]);
    }
    for (const coord of summary ? GM_GRID : PLAYER_GRID) {
        if (!occupied(page.getPageElements(), coord)) {
            return coord;
        }
    }
}

function addTimePair(charName, charPage, sumPage, effect, initTime) {
    if (charPage !== null) {
        addTime(charName, charPage, false, effect, initTime);
    }
    addTime(charName, sumPage, true, effect, initTime);
}

function addTime(charName, page, addingToSummary, effect, initTime) {
    const targetPage = SlidesApp.getActivePresentation()
        .getSlides()[page];
    const xy = freeCoordinates(targetPage, addingToSummary);
    if (xy === undefined) {
        SlidesApp.getUi().alert("No room on the "
            + (addingToSummary ? "Summary" : charName)
            + " slide. No counter has been added to this slide.");
        return;
    }
    const x = xy[0];
    const y = xy[1];
    const box = targetPage.insertShape(
        SlidesApp.ShapeType.RECTANGLE, x, y, 210, 65);
    box.getBorder().setWeight(1);
    const title = targetPage.insertTextBox(effect, x, y, 135, 65);
    title.getText().getTextStyle().setFontSize(19);
    if (addingToSummary) {
        title.getText().setText(charName+": "+effect);
        title.getText().getTextStyle().setFontSize(15);
    }
    title.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    title.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

    const commText = initTime === "00:00" ? "Passed" : "Left";
    const comment = targetPage.insertTextBox(commText, x + 135, y, 75, 25);
    comment.getText().getTextStyle().setFontSize(13);
    comment.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    comment.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);

    const time = targetPage.insertTextBox(initTime, x + 135, y + 15, 75, 50);
    time.getText().getTextStyle().setFontSize(22);
    time.getText().getParagraphStyle()
        .setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    time.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    time.setTitle(initTime === "00:00" ? CLOCK_BOX_CODE : TIMER_BOX_CODE);
    targetPage.group([box, title, time, comment]);
}

function delClockPair(name, page, summaryPage) {
    console.log(page+" "+summaryPage);
    if (page !== null) {
        delClock("", page);
    }
    delClock(name+":", summaryPage);
}

function delClock(name, page) {
    targetPage = SlidesApp.getActivePresentation().getSlides()[page];
    for (const elem of targetPage.getPageElements()) {
        if (elem.getPageElementType() === SlidesApp.PageElementType.GROUP) {
            let isClock = false;
            let ofRightChar = false;
            for (const subElem of elem.asGroup().getChildren()) {
                if (subElem.getTitle() === CLOCK_BOX_CODE) {isClock = true;}
                if (subElem.asShape().getText().asString().startsWith(name)) {
                    ofRightChar = true;
                }
            }
            if (isClock && ofRightChar) {elem.asGroup().remove();}
        }
    }
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
                        m = m - 1;
                        if (m === -1) {
                            m = 59;
                            h = h - 1;
                        }
                        if (h === 0 && m === 0) {
                            i.asGroup().remove();
                            continue;
                        }
                        h = addZero(h);
                        m = addZero(m);
                        j.asShape().getText().setText(h+":"+m);
                    } else if (j.getTitle() === CLOCK_BOX_CODE) {
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
