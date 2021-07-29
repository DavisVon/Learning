//GLOBAL VAL
//====================================================================================================================================================
//FOR PAGE SCENARIO
//system path place
window.domainUrlVal;
var domainUrlVal = window.domainUrlVal;
domainUrlVal = "";
//current web path
window.urlReport = window.location.origin + window.location.pathname;
window.urlContext = window.location.pathname.split('/')[1];
window.urlHost = window.location.origin;
/**
 * 2019-12-10
 * flow Flag function replace functionCount_
 * doing global Flag
 */
window.flowFlag;
var flowFlag = window.flowFlag,
    functionCount_ = window.flowFlag;
flowFlag = 0, functionCount_ = 0;

//current path param define
window.parentParams;
var parentParams = window.parentParams;
parentParams = {};

//2021-01-29 执行单次的方法
function once(fn, context) {
    var result;
    return function() {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}


//2021-01-28 悬浮框插件中，获取所有id和name

window.pluginSheetList;
var sheetList = window.pluginSheetList;
sheetList = new Array();

window.defSheetMap;
var defSheetMap = window.defSheetMap;


var getSheetList = function() {
        if (FR.constructor === Object) {
            var list;
            FR.ajax({
                url: FR.fineServletURL + "/url/sheet/info?sessionId=" + _g().currentSessionID,
                success: function(data) {
                    debugger;
                    list = FR.jsonDecode(data);
                    sheetList = list;
                },
                async: false
            });
            debugger;
            if (sheetList.length > 0) {
                defSheetMap = {};
                $.each(sheetList, function(index, indexValue) {
                    defSheetMap[$.trim(indexValue.name)] = $.trim(indexValue.id);
                });

            }


        }
    }
    //2021-01-29 初始化，将悬浮框插件中的span都挂上监听。**执行一次
var pluginFnOnce = once(function() {
    getSheetList();
    $.each($('li[class*="hg-font-lv1"] span, li[class*="hg-font-lv1"]'), function() {
        debugger;
        $(this).click(function() {
            var clickedSheet = "";
            clickedSheet = $.trim(this.innerText);
            console.log("in click listen func: " + clickedSheet);
            var sheetId = defSheetMap[clickedSheet];
            console.log("searching sheet: " + defSheetMap[clickedSheet]);
            if (traceMarkParams.length == 0) {
                traceMarkClass.init();
            }
            traceMarkParams.openedList.push(sheetId);
            return;
        });
    });
});


//init current path param to objs
function page_init() {
    var params = window.location.search.substring(1).split("&");
    $.each(params, function(index, value) {
        if (value.split('=')[0] != "viewlet" && value.split('=')[0] != "reportlet" && value.split('=')[0] != "restParam") {
            parentParams[value.split('=')[0]] = value.split('=')[1];
        }
    });
    if (this.frCommon.validFlag(parentParams.__parameters__)) {
        var parentParams_ = JSON.parse(this.decodeURI(parentParams.__parameters__));
        if (frCommon.validFlag(parentParams_.viewlet)) {
            delete parentParams_.viewlet;
            delete parentParams_.restParam;
        }
        if (frCommon.validFlag(parentParams_.reportlet)) {
            delete parentParams_.reportlet;
            delete parentParams_.restParam;
        }
        parentParams = {};
        parentParams = parentParams_;
        getSheetList();
    }
}

//====================================================================================================================================================
//FOR CLASS SCENARIO
/**
 * 2019-12-10
 * traceMark Class
 *  define TraceMarkParam
 */
window.EMPTY = "EMPTY";
window.EXEC = "EXEC";
window.CHANGE = "CHANGE";
window.JUMP = "JUMP";
window.MARK_ACTIVE = "markActive";
window.MARK_DEACTIVE = "markDeactive";
window.traceMarkParams;
var traceMarkParams = window.traceMarkParams;
traceMarkParams = {}

/***
 * 2019-12-10
 * request class
 * define file
 */
window.wpUrl = urlReport + window.location.search.split('=')[0] + "=";
/***
 * 2020-02-18
 * history Ctrl process count val
 */
var hisCtrlCount = window.hisCtrlCount;
hisCtrlCount = null;
//====================================================================================================================================================
/**
 * class function def 
 * dun change!!!
 */
function Class() {}
Class.prototype.construct = function() {};
Class.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
    };

    var proto = new this(Class);
    var superClass = this.prototype;

    for (var n in def) {
        var item = def[n];
        if (item instanceof Function) item.$ = superClass;
        proto[n] = item;
    }

    classDef.prototype = proto;

    classDef.extend = this.extend;
    return classDef;
};
//====================================================================================================================================================
//FrCommon Class
var FrCommon = Class.extend({
    //get Value extend FR
    getValue: function(col, row) {
        col = col - 1;
        row = row - 1;
        return contentPane.getCellValue(col, row);
    },
    //get sheetbar tab value
    sheetBarValue: function() {
        var $sheetBar = $("div.content-container");
        var tabArray = $sheetBar.data('TabPane').tabBtns;
        return tabArray;
    },
    //get element obj by compName
    frCompFunc: function(compName) {
        return contentPane.$contentPane.data(compName);
    },
    //check param valid
    validFlag: function(paramTag) {
        return !(typeof(paramTag) == "undefined");
    },
    cellLoc: function(location) {
        return FR.cellStr2ColumnRow(location);
    },
    //waiting merge 2019-11-11
    /**
     * getting Special Value id by current CellLoc
     * @param {String} cvName CellValue
     * @param {String} cellLoc CurrentCellLoc
     */
    getTdId: function(cvName, cellLoc) {
        var sheetIndex = cellLoc.split("-")[1];
        return $('tr[id^="r-"][id$="-' + sheetIndex + '"] td[cv="\"' + cvName + '\""]').attr("id");
    },
    splitAlphaNNum: function(str) {
        var alphaReg = /[A-Z]+/ig;
        var numberReg = /[0-9]+/ig;
        var result = {};
        result.alpha_str = str.replace(numberReg, "");
        result.number_str = str.replace(alphaReg, "");
        return result;
    },
    getRowValueByValue: function(cellLoc, check_array) {
        var result_value = "";
        $.each(check_array, function(index, value) {
            if (frCommon.getTdId(value, cellLoc) != null) {
                result_value = frCommon.getTdId(value, cellLoc);
            }
        });
        var targetCell = this.splitAlphaNNum(result_value.split('-')[0]);
        var currCell = this.splitAlphaNNum(cellLoc);
        return $("#" + targetCell.alpha_str + currCell.number_str).text();
    },
    getRowValueByString: function(cellLoc, checkString) {
        var result_value = "";
        if (frCommon.getTdId(checkString, cellLoc) != null) {
            result_value = frCommon.getTdId(checkString, cellLoc);
        }
        var targetCell = this.splitAlphaNNum(result_value.split('-')[0]);
        var currCell = this.splitAlphaNNum(cellLoc);
        return $("#" + targetCell.alpha_str + currCell.number_str).text();
    }
});
var frCommon = new FrCommon();
//====================================================================================================================================================
//page class
var PageClass = Class.extend({
    //param from win.location.search
    getUrlParam: function(paramName) {
        var winLoc = window.location;
        var params = {};
        var pair = winLoc.search.substring(1).split('&'); //先检查iframe的url
        for (var i = 0; i < pair.length; i++) {
            if (pair[i] != "" && pair[i].indexOf("=") >= 0) {
                var kv = pair[i].split('=');
                params[kv[0]] = kv[1];
            }
        }
        if (params[paramName]) {
            return params[paramName];
        } else {
            return params[paramName] = "N/A";
        }
    },
    //PROJECT V1 FUNC.
    getHostUrl: function(col, row) {
        domainUrl = frCommon.getValue(col, row);
        return domainUrl;
    },
    //PROJECT V2 FUNC
    //JSON param on url
    paramJson: function(objs) {
        var paramStr = "&__parameters__=" + encodeURI(JSON.stringify(objs));
        return paramStr;
    }
});
var pageClass = new PageClass();
//====================================================================================================================================================
//sheet class
var SheetClass = Class.extend({
    //SUPPORT FUNCTION
    //Fetching Sheet Tab Index
    getIdxBySheetname: function(sheetname) {
        var idx = -1;
        $.each(frCommon.sheetBarValue(), function(idx_, val) {
            idx = (val.options.name == sheetname) ? idx_ : idx;
        });
        return idx;
    },
    //existed checkbok val
    menuCheckBox: function(location) {
        var frObj = frCommon.cellLoc(location);
        var row = frObj.row + 1;
        var col = frObj.col + 2;
        var cellValue = frCommon.getValue(col, row).toString();
        return (cellValue == "true" || cellValue == "TRUE");
    },
    //USING FUNCTION
    //PROJECT V1 FUNC.
    jumpSheetMenu: function(sheetname, col, row) {
        var targetIdx = this.getIdxBySheetname(sheetname);
        var flag_str = frCommon.getCellValue(col, row).toString();
        return (flag_str == "true" || flag_str == "TRUE") ? frCommon.selectTabAt(targetIdx) : console.log("ERROR MENU INDEX");
    },
    //PROJECT V1 FUNC.
    jumpSheet: function(sheetname) {
        var targetIdx = this.getIdxBySheetname(sheetname);
        return frCommon.frCompFunc('TabPane').selectTabAt(targetIdx);
    },
    //PROJECT V2 FUNCTION
    //Jump page by dync fetching 2019-09-11
    jumpSheetLocation: function(location, colMark, checkBox, menuSheetName) {
        var locObj = frCommon.cellLoc(location)
        var sheetIdx = 0;
        var row = locObj.row + 1;
        sheetIdx = frCommon.validFlag(menuSheetName) ? this.getIdxBySheetname(menuSheetName) : sheetIdx;
        if (frCommon.validFlag(traceMarkParams.openedList)) {
            traceMarkParams.openedList.push($('td[id*="' + colMark + row + '-' + sheetIdx + '-"]').text());
        }
        if (!frCommon.validFlag(checkBox)) {
            return sheetClass.jumpSheet($('td[id*="' + colMark + row + '-' + sheetIdx + '-"]').text());
        } else if (pageClass.getUrlParam("op") == "view") {
            return sheetClass.jumpSheet($('td[id*="' + colMark + row + '-' + sheetIdx + '-"]').text());
        } else {
            return this.menuCheckBox(location) ? sheetClass.jumpSheet($('td[id*="' + colMark + row + '-' + sheetIdx + '-"]').text()) : null;
        }
    },
    //2021-01-29 返回上一步
    backSheet: function() {
        if (typeof(traceMarkParams) != "undefined" && traceMarkParams.openedList.constructor === Array && traceMarkParams.openedList.length > 0) {
            //逻辑：先去除数组最后一个，然后再加载去除后的数组中的最后一个。
            var openedList = traceMarkParams.openedList;
            var localPin = traceMarkParams.openedList.length - 1;
            if (localPin > 0) {
                openedList.splice(localPin, 1);
                localPin = openedList.length - 1;
                sheetClass.jumpSheet(openedList[localPin]);
            } else {
                sheetClass.jumpSheet("MENU");
            }

        }
    }
});
var sheetClass = new SheetClass();
//====================================================================================================================================================
//Compo class
var CompoClass = Class.extend({
    //PROJECT V1 FUNC
    //Filtering download excel sheet Main Proc
    excelExportFilter: function(sheetname, col, row, defSheet) {
        sheetClass.jumpSheet(sheetname);
        var menuArray = frCommon.getValue(col, row);
        var filterArray = new Array();
        (defSheet == null || defSheet == '' || !frCommon.validFlag(defSheet)) ? filterArray.push(0): filterArray.push(defSheet);
        $.each(menuArray, function(index, value) {
            var sheetIdx = value.split("&")[0];
            var sheetVal = value.split("&")[1];
            if (sheetVal == null || sheetVal.length == 0 || sheetVal == '' || sheetIdx == null || sheetIdx.length == 0 || sheetIdx == '') {
                return true;
            } else {
                if (sheetVal == "true" || sheetVal == "TRUE") {
                    filterArray.push(sheetIdx);
                }
            }
        });
        var actionPath = urlReport + "?op=export&sessionID=" + contentPane.currentSessionID + "&format=excel&extype=simple";
        var sheetStr = '&sheets=' + encodeURI('[' + filterArray + ']');
        filterArray.length == 0 ? window.open(actionPath) : window.open(actionPath + sheetStr);
    },
    msgArlet: function(noticeTitle, noticeMsg) {
        FR.Msg.alert(noticeTitle, noticeMsg);
    },
    floatDialog: function(dialogUrl, paramJson, dialogTitle, ratioH, ratioW) {
        dialogUrl = dialogUrl + "&__parameters__=" + encodeURI(paramJson);
        var innerContent = "";
        innerContent = '<div style="height:100%;width:100%"><iframe src="' + !(dialogUrl.length == 0 || dialogUrl == "") ? dialogUrl : "" + '"';
        innerContent = innerContent + ' style="height:100%;width:100%"></iframe></div>';
        ratioH = (frCommon.validFlag(ratioH)) ? ratioH : 4;
        ratioW = (frCommon.validFlag(ratioW)) ? ratioW : 6;
        var dHeight = window.innerHeight / 12 * ratioH;
        var dWidth = window.innerWidth / 12 * ratioW;
        FR.showDialog(dialogTitle, dWidth, dHeight, innerContent);
    },
    tabOpen: function(dialogUrl, paramJson) {
        window.open(!(dialogUrl.length == 0 || dialogUrl == "") ? dialogUrl + "&__parameters__=" + encodeURI(paramJson) : "");
    }
});
var compoClass = new CompoClass();
//====================================================================================================================================================
//trace back class
var TraceBackClass = Class.extend({
    //PROJECT V1 FUNC
    //jump page in current cpt
    parallelJump: function(sheetname) {
        sheetClass.jumpSheet(sheetname);
    },
    //PROJECT V1 FUNC
    //jump to other cpt
    levelsJump: function(switchBox, cptFile, folderPath) {
        var openPath = urlHost + '/' + urlContext + "/ReportServer?reportlet=" + folderPath + cptFile + ".cpt";
        var paramSet = "&__parameters__=" + encodeURI(JSON.stringify(parentParams));
        switchBox = switchBox.toUpperCase();
        switch (switchBox) {
            case "OPEN":
                window.open(openPath + paramSet);
                break;
            case "HREF":
                window.location.href = urlReport + openPath.substring(openPath.indexOf('?')) + paramSet;
                break;
            default:
                window.open(openPath + paramSet);
                break;
        }
    },
    //PROJECT V1 FUNC
    //special cpt jump with special param
    endSourceJump: function(switchBox, cptFile, folderPath, accCodeArray) {
        var openPath = urlHost + '/' + urlContext + "/ReportServer?reportlet=" + folderPath + cptFile + ".cpt";
        parentParams.accCode = accCodeArray;
        var paramSet = "&__parameters__=" + encodeURI(JSON.stringify(parentParams));
        switchBox = switchBox.toUpperCase();
        switch (switchBox) {
            case "OPEN":
                window.open(openPath + paramSet);
                break;
            case "HREF":
                window.location.href = urlReport + openPath.substring(openPath.indexOf('?')) + paramSet;
                break;
            default:
                window.open(openPath + paramSet);
                break;
        }
    }
});
var traceClass = new TraceBackClass();
//====================================================================================================================================================
/**
 * 2019-10-23
 * TraceMark class
 * new trace back function
 * marking cell which had been traced
 */
var TraceMarkClass = Class.extend({
    //init param set
    // for class func
    init: function() {
        if (JSON.stringify(traceMarkParams) == "{}" && typeof traceMarkParams === "object") {
            traceMarkParams.openedList = new Array();
            traceMarkParams.targetSheet = "";
            traceMarkParams.targetCell = new Array();
            traceMarkParams.entranceFlag = EMPTY;
        }
        flowFlag = 1;
    },
    //init param set
    //for jumping wp cpt
    wpInit: function() {
        var wpInit_ = {};
        wpInit_.openedList = new Array();
        wpInit_.targetSheet = "";
        wpInit_.targetCell = new Array();
        wpInit_.entranceFlag = EMPTY;
        return wpInit_;
    },
    /**
     * setting Cell 
     * for class func
     * @param {*} targetSheet String
     * @param {*} targetCell Array
     * @param {*} cssType CSS type
     * @param {*} cssValue CSS value
     * log:2021-02-02 禅道BUG#4310 太平EIT--汇算清缴工作底稿-SHEET页跳转后黄色单元格高光显示失效
     */
    markCell: function(targetSheet, targetCell, cssClassName) {
        $.each(targetCell, function(index, value) {
            var targetCellStr;
            targetCellStr = value + "-" + sheetClass.getIdxBySheetname(targetSheet) + "-";
            $('tr[id^="r-"] td[id^="' + targetCellStr + '"]')
            $('tr[id^="r-"] td[id^="' + targetCellStr + '"]').removeClass(MARK_ACTIVE);
            $('tr[id^="r-"] td[id^="' + targetCellStr + '"]').removeClass(MARK_DEACTIVE);
            $('tr[id^="r-"] td[id^="' + targetCellStr + '"]').addClass(cssClassName);
        });
    },
    /**
     * check existed opened list
     * for class func
     * true: sheet not exist
     * false : sheet existed
     * @param {*} targetSheet String
     */
    arrayCheck: function(targetSheet) {
        return ($.inArray(targetSheet, traceMarkParams.openedList) <= -1);
    },
    /**
     * setting traceMarkParams 
     * deciding params to new or existed
     * @param {*} targetSheet String
     * @param {*} targetCell Array
     * @param {*} entranceFlag CONST
     * @param {*} cssType CssType
     * @param {*} cssValue CssValue
     */
    processRoute: function(targetSheet, targetCell, entranceFlag, className) {
        var inArrayCheck_ = this.arrayCheck(targetSheet);
        if (inArrayCheck_) {
            traceMarkParams.openedList.push(targetSheet);
            traceMarkParams.targetSheet = targetSheet;
            traceMarkParams.targetCell = targetCell;
            traceMarkParams.entranceFlag = entranceFlag;
            sheetClass.jumpSheet(targetSheet);
        } else {
            traceMarkParams.targetSheet = targetSheet;
            traceMarkParams.targetCell = targetCell;
            sheetClass.jumpSheet(targetSheet);
            traceMarkParams.entranceFlag = CHANGE;
            this.markCell(targetSheet, targetCell, className);
        }
    }
});
var traceMarkClass = new TraceMarkClass();
//====================================================================================================================================================
//request class
var RequestClass = Class.extend({
    callRoute: function(data) {
        $.ajaxSettings.async = false;
        var fileStr = this.callFilePathByPayer(data);
        $.ajaxSettings.async = true;
        return fileStr;
    },
    //callFilePath(FR cpt doc-norm mode)
    callFilePath: function(data) {
        var url = (typeof(data.baseUrl) != 'undefined') ? data.baseUrl : "";
        url = url + "/rpttmpl.do";
        var funcRes = "";
        var jsonData = '{"rptCode":"' + data.tmplCode + '","rptDate":"' + data.rptDate + '"}';
        if (url != "") {
            $.ajax({
                url: url,
                type: "POST",
                datType: "json",
                contentType: "application/json",
                data: jsonData,
                async: false,
                success: function(result) {
                    //debugger;
                    if (result.code === "200") {
                        var path = requestClass.getTemplateInfo(result.resultList[0].templateId, data);
                        wpUrl = wpUrl + path;
                        funcRes = path;
                    } else {
                        funcRes = "ERROR";
                    }
                }
            });
            return funcRes
        } else {
            return "ERROR";
        }
    },
    //callFilePath(FR cpt doc-payer mode)
    callFilePathByPayer: function(data) {
        var url = (typeof(data.baseUrl) != 'undefined') ? data.baseUrl : "";
        url = url + "/rpttmpl2.do";
        data.funcType = "PAYER";
        var funcRes = "";
        var jsonData = '{"rptCode":"' + data.tmplCode + '","rptDate":"' + data.rptDate + '","filingType":"' + data.filingType + '","taxType":"' + data.taxType + '","rptType":"' + data.rptType + '"}';
        if (url != "") {
            $.ajax({
                url: url,
                type: "POST",
                datType: "json",
                contentType: "application/json",
                data: jsonData,
                async: false,
                success: function(result) {
                    //debugger;
                    if (result.code === "200") {
                        var path = requestClass.getTemplateInfo(result.resultList[0].templateId, data);
                        wpUrl = wpUrl + path;
                        funcRes = path;
                    } else {
                        funcRes = requestClass.callFilePath(data);
                    }
                }
            });
            return funcRes;
        } else {
            return "ERROR";
        }
    },
    callFileSetPath: function(data) {
        var rptCodeSet = new Array();
        var rptDateSet = new Array();
        if (data.tmplSet.constructor === String && data.rptDateSet.constructor === String) {
            rptCodeSet.push(data.tmplSet);
            rptDateSet.push(data.rptDateSet);
        } else {
            rptCodeSet = data.tmplSet;
            rptDateSet = data.rptDateSet;
        }
        callFileResult[data.period_type] = typeof(callFileResult[data.period_type]) == 'undefined' ? {} : callFileResult[data.period_type];
        callFileResult[data.period_type].pathList = {};
        $.each(rptCodeSet, function(index, val) {
            $.ajax({
                url: data.baseUrl + "/rpttmpl.do",
                type: "POST",
                datType: "json",
                contentType: "application/json",
                async: false,
                data: '{"rptDate":"' + rptDateSet[index] + '","rptCode":"' + val + '"}',
                success: function(result) {
                    //debugger;
                    if (result.code === "200") {
                        fullReportInfo = result;
                        if (result.resultList.constructor === Array && result.resultList.length > 0) {
                            var path = requestClass.getTemplateInfo(result.resultList[0].templateId, data);
                            fullReportInfo.urlFilePath = typeof(path) === "undefined" ? "" : path;
                            callFileResult[data.period_type].pathList[fullReportInfo.resultList[0].rptCode] = path;
                        }
                    } else {
                        console.error("ERROR" + result.code);
                    }
                }
            });
        });
        return callFileResult[data.period_type].pathList;
    },
    getTemplateInfo: function(tmplId, data) {
        var fullReportInfo;
        $.ajax({
            url: data.baseUrl + "/rpttmpldetail.do?templateId=" + tmplId,
            type: "GET",
            datType: "json",
            contentType: "application/json",
            async: false,
            success: function(result) {
                if (result.code === "200") {
                    if (result.resultList.constructor === Array && result.resultList.length > 0) {
                        fullReportInfo = result.resultList[0].rptPath;
                    } else {
                        console.error("ERROR 报错信息：没有符合模板版本类型，请重新确认！");
                    }
                } else {
                    console.error("ERROR 报错信息：" + result.message);
                }
            }
        });
        return fullReportInfo;
    }
});
var requestClass = new RequestClass()

//====================================================================================================================================================
/***
 * 2019-12-10
 * PROJECT V2 FUNCTION 
 */
/**
 * 2019-12-10
 * 1. wp init load process
 * 2. when changing any sheet will process
 * 3. deciding cell mark
 * @param {*} activeCssType CssType
 * @param {*} activeCssValue CssValue
 * @param {*} deactiveCssType CssType
 * @param {*} deactiveCssValue CssValue
 */
function wp_loadProcess(cssClassName_active, cssClassName_deactive) {
    //2021-01-29 增加单次执行的悬浮框插件方法
    // pluginFnOnce();
    if (flowFlag == 0) {
        page_init();
        traceMarkClass.init();
        //from JUMP type 
        if (frCommon.validFlag(parentParams.traceMarkParams) && parentParams.traceMarkParams.entranceFlag == JUMP) {
            traceMarkParams = parentParams.traceMarkParams;
            traceMarkParams.entranceFlag = EXEC;
            traceMarkParams.openedList.push(traceMarkParams.targetSheet);
            sheetClass.jumpSheet(traceMarkParams.targetSheet);
        }
    } else if (traceMarkParams.entranceFlag == EXEC) {
        traceMarkParams.entranceFlag = CHANGE;
        traceMarkClass.markCell(traceMarkParams.targetSheet, traceMarkParams.targetCell, cssClassName_active);
    }
    $(".fr-sheetbutton-container").click(function() {
        if (traceMarkParams.entranceFlag == CHANGE) {
            traceMarkParams.entranceFlag = EMPTY;
            traceMarkClass.markCell(traceMarkParams.targetSheet, traceMarkParams.targetCell, cssClassName_deactive);
        }
    });
}
/**
 * 2019-12-10
 * ret init load
 * 1. ret init load process, doing req wp path
 * 2. when changing any sheet will process
 * 3. deciding cell mark
 * @param {*} activeCssType CssType
 * @param {*} activeCssValue CssValue
 * @param {*} deactiveCssType CssType
 * @param {*} deactiveCssValue CssValue
 */
function ret_loadProcess(data, cssClassName_active, cssClassName_deactive, dbCol, dbRow) {
    //2021-01-29 增加单次执行的悬浮框插件方法
    // pluginFnOnce();
    var callPath = "";
    if (flowFlag == 0) {
        page_init();
        try {
            debugger;
            callPath = requestClass.callRoute(data);
        } catch (error) {
            throw error.toString();
        }
        wpUrl = callPath == "ERROR" ? wpUrl + frCommon.getValue(dbCol, dbRow) : wpUrl;
        traceMarkClass.init();
    } else if (traceMarkParams.entranceFlag == EXEC) {
        traceMarkParams.entranceFlag = CHANGE;
        traceMarkClass.markCell(traceMarkParams.targetSheet, traceMarkParams.targetCell, cssClassName_active);
    }
    $(".fr-sheetbutton-container").click(function() {
        if (traceMarkParams.entranceFlag == CHANGE) {
            traceMarkParams.entranceFlag = EMPTY;
            traceMarkClass.markCell(traceMarkParams.targetSheet, traceMarkParams.targetCell, cssClassName_deactive);
        }
    });
}
/**
 * 2019-12-10
 * setting on Cell 
 * @param {String} targetSheet 
 * @param {Array} cellArray 
 * @param {CONST} entranceFlag 
 * @param {String} cssType 
 * @param {String} cssValue 
 */
function formulaMark(targetSheet, cellArray, entranceFlag, cssClassName_active) {
    traceMarkClass.markCell(traceMarkParams.targetSheet, traceMarkParams.targetCell, MARK_DEACTIVE);
    var targetSheet_ = decodeURI(targetSheet);
    if (entranceFlag == EMPTY) {
        traceMarkClass.processRoute(targetSheet_, cellArray, EXEC, cssClassName_active);
    }
}
/**
 * set ret -> wp cell
 * 1.setting init dependence
 * 2. set param to new init
 * @param {String} targetSheet 
 * @param {Array} cellArray 
 * @param {CONST} entranceFlag 
 * @param {String} cssType 
 * @param {String} cssValue 
 */
function formulaMark_ret(targetSheet, targetCell, cssClassName_active) {
    parentParams.traceMarkParams = traceMarkClass.wpInit();
    parentParams.traceMarkParams.targetSheet = targetSheet;
    parentParams.traceMarkParams.targetCell = targetCell;
    parentParams.traceMarkParams.entranceFlag = JUMP;
    parentParams.traceMarkParams.className = cssClassName_active
        // wpUrl = "http://localhost:8080/rpt/ReportServer?reportlet=CIT-WP.cpt"
    window.open(wpUrl + pageClass.paramJson(parentParams));
}
//====================================================================================================================================================
/*
PROJECT V1 FUNCTION
*/

/**
 * default sheet Menu function set
 */
function jumpSheetLocation(location, colMark, checkBox, menuSheetName) {
    sheetClass.jumpSheetLocation(location, colMark, checkBox, menuSheetName);
}

function jumpSheetMenu(sheetname, col, row) {
    sheetClass.jumpSheetMenu(sheetname, col, row);
}

function jumpSheet(sheetname) {
    sheetClass.jumpSheet(sheetname);
}

function getUrlParam(paramName) {
    return pageClass.getUrlParam(paramName);
}

function getHostUrl(col, row) {
    if (domainUrlVal.length == 0) {
        domainUrlVal = pageClass.getHostUrl(col, row);
    }
}
/**
 * default Compo function set
 */
function excelExportFilter(sheetname, col, row, defSheet) {
    compoClass.excelExportFilter(sheetname, col, row, defSheet);
}
/**
 * default trace back function set
 */
function parallelJump(sheetname) {
    traceClass.parallelJump(sheetname);
}

function levelsJump(switchBox, cptFile, folderPath, urlKey) {
    traceClass.levelsJump(switchBox, cptFile, folderPath, urlKey);
}

function endSourceJump(switchBox, cptFile, folderPath, accCodeArray, urlKey) {
    traceClass.endSourceJump(switchBox, cptFile, folderPath, accCodeArray, urlKey);
}
/**
 * excel btn control,from ccs version 
 * merge:2019-04-22
 */
function excelBtn(check) {
    if (check == 'true') {
        excelBtnVal = 'true';
        contentPane.toolbar.options.items[2].setVisible(true);
    } else if (check == null && excelBtnVal == "false") {
        contentPane.toolbar.options.items[2].setVisible(false);
    }
}
//EIT upload btn
function docUploadBtn(sheetCode, sheetName, jspPagePath) {
    var fillingID = parentParams.fillingID;
    var entityID = parentParams.entityID;
    var uploadPage = domainUrlVal + jspPagePath + "?filingID=" + fillingID + "&entityID=" + entityID + "&sheetCode=" + sheetCode + "&sheetName=" + encodeURI(sheetName);
    window.open(uploadPage);
}

//====================================================================================================================================================
//PROJECT V3 FUNC
//FOR CITIC PROJECT ONLY
//waiting merge 2019-11-11
function getTdId(cvName, cellLoc) {
    var sheetIndex = cellLoc.split("-")[1];
    return $('tr[id^="r-"][id$="-' + sheetIndex + '"] td[cv="\"' + cvName + '\""]').attr("id");
}

function getSheetCode(cellLoc) {
    var sheetCodeId_ = "";
    var sheet_check_array = ["SHEETCODE", "sheetCode", "SheetCode", "sheetcode"];
    sheetCodeId_ = frCommon.getRowValueByValue(cellLoc, sheet_check_array)
    return sheetCodeId_;
}

function getLineCode(cellLoc) {
    var line_check_array = ['ID', 'id', 'Id', 'iD'];
    return frCommon.getRowValueByValue(cellLoc, line_check_array);
}
$winOpen = null;

var openCallBack = setInterval(function() {
    if ($winOpen != null && $winOpen.closed && flowFlag == 999) {
        contentPane.refreshAllSheets();
        flowFlag = 1;
    }
}, 800);

function uploadCom(data) {
    var url = data.url;
    var param = data.param;
    $.each(param, function(key, value) {
        url = url + '&' + key + '=' + value;
    });
    $winOpen = window.open(url);
    flowFlag = 999;
}

function citicUploadCom(param) {
    var data = {};
    data.url = domainUrlVal + "/dm/jsp/datamart/dmfileattachuploadeditview.jsp?"
    data.param = param
    uploadCom(data);
}

function noDataSave() {
    var config = {};
    config.title = "提示";
    config.text4OK = "【确认】";
    config.text4Cancel = "【取消】";
    config.onOK = function() {
        contentPane.verifyAndWriteReport(true);
    };
    config.contentHtml = "<span>当前操作无法执行文件上传！<br/>原因：数据尚未保存！<br/>【确认】：保存数据<br/>【取消】：取消当前操作</span>";
    config.height = window.innerHeight / 12 * 3;
    config.width = window.innerWidth / 12 * 4;
    FR.showConfirmDialog(config);
    $('div[class*="fr-core-panel-tool-close"]').click(function() {
        contentPane.refreshAllSheets();
    });
}
/**
 * call Single File
 * @param {Array} paramArray 
 * @param {String/null} baseUrl 
 * @param {String} op_mode 
 */
function callFile(paramArray, op_mode, cellId, period_type) {
    var data = {}
    $.each(paramArray, function(index, value) {
        data[value] = frCommon.getRowValueByString(cellId, value);
    });
    data.op = op_mode;
    var url = "";
    if (window.callFileResult.constructor === Object) {
        var obj = window.callFileResult;
        if (obj[period_type].constructor === Object) {
            if (obj[period_type].pathList.constructor === Object)
                url = wpUrl + obj[period_type].pathList[data.tmplCode] + pageClass.paramJson(data);
        }
    }
    if (url.length == 0) {
        console.info("========== no wp url ==========");
    } else {
        window.open(url);
    }
}

function callFileSet(data, tmplCodeSet, rptDateSet, period_type) {
    data.funcType = "NORM_ARRAY";
    data.tmplSet = tmplCodeSet.toString();
    data.rptDateSet = rptDateSet.toString();
    data.period_type = period_type;
    requestClass.callFileSetPath(data);
}
/**
 * Disable all comp.
 */
function workFlowCtrl() {
    $('td[editor]').removeAttr('editor');
    $(".x-editor").remove();
    $('button[class*="x-emb-add"]').attr("disabled", "true");
    $('button[class*="x-emb-delete"]').attr("disabled", "true");
    $('button[class*="x-emb-add"]').parent().parent().parent().css("background-color", "grey");
    $('button[class*="x-emb-delete"]').parent().parent().parent().css("background-color", "grey");
    $('div[widgetname="Submit"]').remove();
    $('span[class*="fr-radio-"]').click(function() {
        return;
    });
}
/**
 * 2020-02-17
 * revert last control
 * only for TraceBack parellel Jumpsheet!
 */
function hisCtrlProc(noticeTitle, noticeMsg) {
    var targetCtrl = "";
    if (frCommon.validFlag(traceMarkParams.openedList)) {
        var openedList = traceMarkParams.openedList;
        var localPin = 0;
        localPin = $.inArray(openedList[openedList.length - 1], openedList);
        if (localPin - 1 >= 0) {
            targetCtrl = openedList[localPin - 1];
            openedList.splice(localPin, 1);
            sheetClass.jumpSheet(targetCtrl);
        } else {
            sheetClass.jumpSheet("MENU");
        }
    } else {
        compoClass.noticeMsg(noticeTitle, noticeMsg);
    }

}