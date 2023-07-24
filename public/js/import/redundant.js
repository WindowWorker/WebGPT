globalThis.lcws=(text1, text2)=>{/*longest common word subsequence*/
    text1 = text1.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').split(' ');
    text2 = text2.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').split(' ');

    const dp = Array(text1.length + 1).fill(0).map(Þ => Array(text2.length + 1).fill(0));
    const dp_length = dp.length;
    for (let i = 1; i < dp_length; i++) {

      for (let j = 1; j < dp[i].length; j++) {
        /* If the words match, look diagonally to get the max subsequence before this letter and add one*/
        if (text1[i - 1] == text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          /* If there is no match, set the cell to the previous current longest subsequence*/
          dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
        }
      }
    }
    return dp[text1.length][text2.length]
  }

globalThis.isSimilarPhrase=(text1, text2)=> {
    text1 = text1.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');
    text2 = text2.toLowerCase().replace(/[^a-z ]/g, ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');

    let numerator = lcws(text1, text2);

    let ratio1 = numerator / text1.split(' ').length;

    let ratio2 = numerator / text2.split(' ').length;

    if (Math.max(ratio1, ratio2) >= 0.8) {

      return true;

    } else {

      return false;

    }


  }

globalThis.removeRedundant=(passage)=> {

    let isSentenceModified = false;
    for (let pass = 0; pass < 2; pass++) {
      let mpassage = passage;
      let pass_regex = /[?!¿¡]/g;
      if (pass) { pass_regex = /[?!¿¡.,:;]/g; }
      mpassage = mpassage.replace(pass_regex, '.')
        .replaceAll('..', '.')
        .replaceAll('..', '.')
        .replaceAll('  ', ' ')
        .replaceAll('  ', ' ');
      console.log(mpassage);
      let mpass_list = mpassage.split('.');
      console.log(mpass_list);
      const mpass_list_length = mpass_list.length;
      for (let i = 0; i < mpass_list_length; i++) {
        try {
          if ((mpass_list[i].length > 1) && (mpass_list[i].split(' ').length > 3)) {
            for (let x = 0; x < mpass_list_length; x++) {
              try {
                if ((i != x) && (mpass_list[x].length > 1) && (mpass_list[x].split(' ').length > 3)) {
                  if (isSimilarPhrase(mpass_list[i], mpass_list[x])) {
                    if (mpass_list[i].length < mpass_list[x].length) {

                      mpass_list[i] = '';
                      isSentenceModified = true;
                      break;

                    } else {

                      mpass_list[x] = '';
                      isSentenceModified = true;
                      continue;

                    }
                  }
                }
              } catch (e) { continue; }
            }
          }
        } catch (e) { continue; }
      }
      console.log(isSentenceModified);
      if (isSentenceModified) {
        passage = mpass_list.join('.')
          .replaceAll('..', '.')
          .replaceAll('..', '.')
          .replaceAll('  ', ' ')
          .replaceAll('  ', ' ')
          .replaceAll(',.', '.')
          .replaceAll('.,', '.');
      }
    }
    return passage;


  }