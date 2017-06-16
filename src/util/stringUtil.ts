export class StringUtil{


  public static removeAccent(inStr) {
  return inStr.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function (str, a, c, e, i, n, o, s, u, y, ae) {
    if (a) return 'a'; else if (c) return 'c'; else if (e) return 'e'; else if (i) return 'i'; else if (n) return 'n'; else if (o) return 'o'; else if (s) return 's'; else if (u) return 'u'; else if (y) return 'y'; else if (ae) return 'ae';
  });
}
}
