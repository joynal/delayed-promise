// Copy pasted from stackoverflow
class BigDecimal {
  constructor(value) {
    let [ints, decis] = String(value).split('.').concat('');
    decis = decis.padEnd(BigDecimal.decimals, '0');
    this.bigint = BigInt(ints + decis);
  }

  static fromBigInt(bigint) {
    return Object.assign(Object.create(BigDecimal.prototype), { bigint });
  }

  divide(divisor) {
    return BigDecimal.fromBigInt(this.bigint * BigInt(`1${'0'.repeat(BigDecimal.decimals)}`) / divisor.bigint);
  }

  toString() {
    const s = this.bigint.toString();
    return `${s.slice(0, -BigDecimal.decimals)}.${s.slice(-BigDecimal.decimals)
      .replace(/\.?0+$/, '')}`;
  }
}

// Configuration of the number of decimals you want to have.
BigDecimal.decimals = 18;

module.exports = BigDecimal;
