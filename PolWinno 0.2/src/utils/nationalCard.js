
const checkNationalCode = (nationalCode) => {
  
    // check kardan e inke addad e varde shode tedad e dorost dashte bashand
    const codeLength = nationalCode.length;
    if (codeLength<8 || codeLength>10 || parseInt(nationalCode,10)==0) return false;
    
    // agar karbar yeki ya dora sefr e aval ro vared nakarde bud
    nationalCode = ("0000" + nationalCode).substr(codeLength + 4 - 11);

    const controlNumber = parseInt(nationalCode.substr(9 , 1));
    let remainder = 0

    // bayad har adad ra dar arzeshashash zarb konim va hasele zarbha ro ba ham jam mishavand
    for (let i=0; i<9; i++) 
        remainder += parseInt(nationalCode.substr(i , 1)) * (10 - i);

    remainder = remainder % 11;

    // agar baghimande kamtar az 2 bashe adade control barabar ba baghimande ast ya
    // agar baghimande bishtar ya mosavi 2 bashe adade control barabar ba 11 menhaye baghimande ast
    if ( (remainder < 2 && controlNumber == remainder) || (remainder >= 2 && controlNumber == (11 - remainder)) );
        return true;
}

module.exports = checkNationalCode;