import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import xlsx from 'exceljs'
import personalInfo from "./personal-information";
import { formatDateTime } from "global/function";
import workExp from "./work-experience";
import otherDetails from "./other-details";


function GenerateExel({
    data
}) {

    const workbook = new xlsx.Workbook()
    const sheet = workbook.addWorksheet('example')
    sheet.getColumn('A').width = 33.5
    sheet.getColumn('B').width = 37.2
    sheet.getColumn('C').width = 27
    sheet.getColumn('D').width = 43.1


    const defaultFont = 'Arial'
    const rowFont = {
        name: defaultFont,
        bold: true,
        size: 10,
    }

    // personal information
    sheet.mergeCells('A1:B1')
    sheet.getCell('A1').font = {
        name: defaultFont,
        bold: true,
        size: 11,
    }
    sheet.getCell('A1').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
    }
    sheet.getCell('A1').alignment = {
        horizontal: 'center'
    }
    sheet.getCell('A1').value = 'Personal Information'

    // work experience
    sheet.mergeCells('A18:B18')
    sheet.getCell('A18').font = {
        name: defaultFont,
        bold: true,
        size: 11,
    }
    sheet.getCell('A18').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
    }
    sheet.getCell('A18').alignment = {
        horizontal: 'center'
    }
    sheet.getCell('A18').value = 'Work Experience'

    // other detials
    sheet.mergeCells('A37:B37')
    sheet.getCell('A37').font = {
        name: defaultFont,
        bold: true,
        size: 11,
    }
    sheet.getCell('A37').border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
    }
    sheet.getCell('A37').alignment = {
        horizontal: 'center'
    }
    sheet.getCell('A37').value = 'Other Details'

    // character reference
    sheet.mergeCells('A49:D49')
    sheet.getCell('A49').font = {
        name: defaultFont,
        bold: true,
        size: 10,
    }
    sheet.getCell('A49').alignment = {
        horizontal: 'center'
    }
    sheet.getCell('A49').value = 'Character Reference'

    sheet.mergeCells('A50:D51')
    sheet.getCell('A50').font = {
        name: defaultFont,
        bold: true,
        italic: true,
        size: 10,
        color: { argb: 'fffe0000'},
    }
    sheet.getCell('A50').alignment = {
        horizontal: 'center'
    }
    sheet.getCell('A50').value = '(please exclude relatives/friends; kindly provide prev. employment head, colleague, and HR)'

    var cell = {
        A: ['Information', 'Name:', 'Position:', 'Email:', 'Contact #:', 'Comapny Name:', 'Company Email:'],
        B: ['1st Character Referecence', '', '', '', '', '', ''],
        C: ['2nd Character Referecence', '', '', '', '', '', ''],
        D: ['3rd Character Referecence', '', '', '', '', '', ''],
    }
    for ( var item in cell ) {
        var cellCount = 53
        for ( var _item in cell[item] ) {
            sheet.getCell(`${item}${cellCount}`).font = {
                name: 'Calibri',
                bold: true,
                size: 9.5,
            }
            sheet.getCell(`${item}${cellCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`${item}${cellCount}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`${item}${cellCount}`).value = cell[item][_item]

            cellCount+=1
        }
    }

    // checkbox disclaimer
    sheet.getCell('A64').font = {
        name: defaultFont,
        bold: true,
        size: 10,
    }
    sheet.getCell('A64').dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Agree, Disagree"']
    }
    sheet.getCell('A64').alignment = {
        horizontal: 'right'
    }
    sheet.getCell('A64').value = 'Select here to Agree'

    sheet.mergeCells('B64:R64')
    sheet.getCell('B64').font = {
        name: defaultFont,
        bold: true,
        italic: true,
        size: 10,
        color: { argb: 'fffe0000'},
    }
    sheet.getCell('B64').value = 'I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, and that any dishonesty or falsification may jeopardize my employment application.'


    useEffect(() => {
        console.log('debug generate data', data);
        var entity = data['entity']

        entity['birthday'] = formatDateTime(entity['birthday'], 'MM-DD-YYYY')
        entity['name'] = `${entity['first_name']} ${entity['last_name']}`
        entity['platform'] = `${data['platform'].title}`

        console.log('debug generate entity', entity);
        console.log('debug personal data', personalInfo);
        var infoCount = 2
        for ( var item in personalInfo ) {
            sheet.getCell(`A${infoCount}`).font = rowFont
            sheet.getCell(`A${infoCount}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A${infoCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A${infoCount}`).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor: { argb: 'ffb7e1cd' },
            }
            sheet.getCell(`A${infoCount}`).value = personalInfo[item]['title']

            sheet.getCell(`B${infoCount}`).value = personalInfo[item]['key'] in entity ? entity[personalInfo[item]['key']] : ''
            sheet.getCell(`B${infoCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }

            infoCount+=1
        }

        var workCount = 19
        for ( var item in workExp ) {
            sheet.getCell(`A${workCount}`).font = rowFont
            sheet.getCell(`A${workCount}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A${workCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A${workCount}`).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor: { argb: 'ffb7e1cd' },
            }
            sheet.getCell(`A${workCount}`).value = workExp[item]['title']

            // sheet.getCell(`B${workCount}`).value = personalInfo[item]['key'] in entity ? entity[personalInfo[item]['key']] : ''
            sheet.getCell(`B${workCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }

            workCount+=1
        }

        var detailsCount = 38
        for ( var item in otherDetails ) {
            sheet.getCell(`A${detailsCount}`).font = rowFont
            sheet.getCell(`A${detailsCount}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A${detailsCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A${detailsCount}`).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor: { argb: 'ffb7e1cd' },
            }
            sheet.getCell(`A${detailsCount}`).value = otherDetails[item]['title']

            // sheet.getCell(`B${detailsCount}`).value = personalInfo[item]['key'] in entity ? entity[personalInfo[item]['key']] : ''
            sheet.getCell(`B${detailsCount}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }

            detailsCount+=1
        }

    },[])


    const handleDownload = () => {
        workbook.xlsx.writeBuffer().then((xlsxData) => {
            const blob = new Blob([xlsxData], {
                type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
            })
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'excel.xlsx'
            anchor.click()
            window.URL.revokeObjectURL(url)
        })
    }

    return (
        <MDButton onClick={handleDownload}>Download</MDButton>
    )
}

export default GenerateExel;