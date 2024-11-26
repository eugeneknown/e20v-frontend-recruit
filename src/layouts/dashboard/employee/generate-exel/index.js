import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import xlsx from 'exceljs'
import personalInfo from "./personal-information";
import { formatDateTime } from "global/function";
import workExp from "./work-experience";
import otherDetails from "./other-details";
import { dataServicePrivate } from "global/function";


function GenerateExel({
    data
}) {

    const [careers, setCareers] = useState()
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()

    const [detailsCell, setDetailsCell] = useState(38)
    const [relevant, setRelevantCell] = useState(36)

    const [expCount, setExpCount] = useState(2)

    const workbook = new xlsx.Workbook()
    const sheet = workbook.addWorksheet('example')
    sheet.getColumn('A').width = 42
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

    useEffect(() => {
        if ('entity_id' in data && 'careers_id' in data){
            // fetching careers for entity, platform data
            dataServicePrivate('POST', 'hr/careers/entity/all', {
                filter: [
                    {
                        operator: '=',
                        target: 'entity_id',
                        value: data['entity_id'],
                    },
                    {
                        operator: '=',
                        target: 'careers_id',
                        value: data['careers_id'],
                    },
                ]
            }).then((result) => {
                console.log('debug generate careers result', result);
                result = result.data['entity_career'][0]
                setCareers(result)
            }).catch((err) => {
                console.log('debug generate careers error', err);
    
            })

            // fetching entity experience data
            dataServicePrivate('POST', 'entity/experience/all', {
                filter: [
                    {
                        operator: '=',
                        target: 'entity_id',
                        value: data['entity_id'],
                    },
                ],
                relations: ['details'],
            }).then((result) => {
                console.log('debug generate experience result', result);
                result = result.data['experience'][0]
                setExperience(result)
                if (Object.keys(result['details']).lengt >= 3) {
                    setRelevantCell(44)
                    setDetailsCell(46)
                    setExpCount(3)
                }
            }).catch((err) => {
                console.log('debug generate experience error', err);
    
            })

            // fetching entity other details
            dataServicePrivate('POST', 'entity/details/all', {
                filter: [
                    {
                        operator: '=',
                        target: 'entity_id',
                        value: data['entity_id'],
                    },
                ],
            }).then((result) => {
                console.log('debug generate other details result', result);
                result = result.data['entity_details'][0]
                setDetails(result)
            }).catch((err) => {
                console.log('debug generate other details error', err);
    
            })
        }

    },[])

    useEffect(() => {
        console.log('debug generate data', data);
        console.log('debug generate careers', careers);
        console.log('debug generate experience', experience);
        console.log('debug generate details', details);

        var platforms
        if (careers) {
            var entity = careers['entity_data']
            var career = careers['careers_data']
            platforms = careers['platforms_data']

            entity['birthday'] = formatDateTime(entity['birthday'], 'MM-DD-YYYY')
            entity['name'] = `${entity['first_name']} ${entity['last_name']}`
            entity['careers'] = `${career['title']}`
    
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
    
                sheet.getCell(`B${infoCount}`).value = personalInfo[item]['key'] in entity ? entity[personalInfo[item]['key']] : 'n/a'
                sheet.getCell(`B${infoCount}`).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
    
                infoCount+=1
            }

        }

        if (experience) {
            sheet.getCell(`A19`).font = rowFont
            sheet.getCell(`A19`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A19`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A19`).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor: { argb: 'ffb7e1cd' },
            }
            sheet.getCell(`A19`).value = 'Total Work Experience'

            sheet.getCell(`B19`).value = 'total_experience' in experience ? experience['total_experience'] : ''
            sheet.getCell(`B19`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }

            sheet.getCell(`A${relevant}`).font = rowFont
            sheet.getCell(`A${relevant}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A${relevant}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A${relevant}`).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor: { argb: 'ffb7e1cd' },
            }
            sheet.getCell(`A${relevant}`).value = 'Other Relevant Experience'

            sheet.getCell(`B${relevant}`).value = 'other_experience' in experience ? experience['other_experience'] : ''
            sheet.getCell(`B${relevant}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }

            var workCount = 20
            for (var i=0; i<expCount;i++) {
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
                    sheet.getCell(`A${workCount}`).value = workExp[item]['key'] == 'company' ? workExp[item]['title'][i] : workExp[item]['title']
        
                    var value = 'n/a'
                    if (experience['details'][i] != undefined) {
                        value = workExp[item]['key'] in experience['details'][i] ? experience['details'][i][workExp[item]['key']] : 'n/a'
                    }
                    sheet.getCell(`B${workCount}`).value = value
                    sheet.getCell(`B${workCount}`).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    }
        
                    workCount+=1
                }
            }
        }

        // other details
        if (details) {
            details['platforms'] = platforms['title']

            sheet.mergeCells(`A${detailsCell-1}:B${detailsCell-1}`)
            sheet.getCell(`A${detailsCell-1}`).font = {
                name: defaultFont,
                bold: true,
                size: 11,
            }
            sheet.getCell(`A${detailsCell-1}`).border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            sheet.getCell(`A${detailsCell-1}`).alignment = {
                horizontal: 'center'
            }
            sheet.getCell(`A${detailsCell-1}`).value = 'Other Details'
    
            var count = detailsCell
            for ( var item in otherDetails ) {
                sheet.getCell(`A${count}`).font = rowFont
                sheet.getCell(`A${count}`).alignment = {
                    horizontal: 'center'
                }
                sheet.getCell(`A${count}`).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
                sheet.getCell(`A${count}`).fill = {
                    type: 'pattern',
                    pattern:'solid',
                    fgColor: { argb: 'ffb7e1cd' },
                }
                sheet.getCell(`A${count}`).value = otherDetails[item]['title']
    
                sheet.getCell(`B${count}`).value = otherDetails[item]['key'] in details ? details[otherDetails[item]['key']] : 'n/a'
                sheet.getCell(`B${count}`).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }
    
                count+=1
            }
        }

    },[careers, experience, details, detailsCell])

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
        <MDButton onClick={handleDownload}>Export</MDButton>
    )
}

export default GenerateExel;