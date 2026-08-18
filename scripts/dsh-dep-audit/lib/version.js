/**
 * Minimal dependency-free semver support for dsh-dep-audit.
 *
 * Implements the subset needed to audit real-world dependency ranges:
 * exact, caret, tilde, star, whitespace-separated comparator chains
 * (e.g. `>=1.2.0 <2.0.0`) and `||` unions, including prerelease rules
 * (a range without a prerelease never matches a prerelease of the same
 * tuple). Everything is tested in tests/version.spec.ts.
 * @module dsh-dep-audit/version
 */
/** Parse `v?X.Y.Z(-pre)?` into a comparable structure, or null. */
export function parseVersion(input) {
    const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(input.trim());
    if (match === null)
        return null;
    const prerelease = match[4] !== undefined && match[4] !== '' ? match[4].split('.') : null;
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        prerelease,
    };
}
function isNumeric(value) {
    return /^\d+$/.test(value);
}
function compareIdentifier(a, b) {
    if (isNumeric(a) && isNumeric(b)) {
        const diff = BigInt(a) - BigInt(b);
        return diff === 0n ? 0 : diff > 0n ? 1 : -1;
    }
    if (isNumeric(a))
        return -1;
    if (isNumeric(b))
        return 1;
    return a < b ? -1 : a > b ? 1 : 0;
}
/** Compare two prerelease identifier lists; a stable version (null) ranks higher. */
export function comparePrerelease(a, b) {
    if (a === null && b === null)
        return 0;
    if (a === null)
        return 1;
    if (b === null)
        return -1;
    const length = Math.max(a.length, b.length);
    for (let i = 0; i < length; i++) {
        const left = a[i];
        const right = b[i];
        if (left === undefined)
            return -1;
        if (right === undefined)
            return 1;
        const diff = compareIdentifier(left, right);
        if (diff !== 0)
            return diff;
    }
    return 0;
}
function tupleOf(version) {
    return [version.major, version.minor, version.patch];
}
function compareTuple(a, b) {
    for (let i = 0; i < 3; i++) {
        const diff = a[i] - b[i];
        if (diff !== 0)
            return diff > 0 ? 1 : -1;
    }
    return 0;
}
/** Compare two full versions. */
export function compareVersions(a, b) {
    const pa = parseVersion(a);
    const pb = parseVersion(b);
    if (pa === null || pb === null)
        return 0;
    const diff = compareTuple(tupleOf(pa), tupleOf(pb));
    if (diff !== 0)
        return diff;
    return comparePrerelease(pa.prerelease, pb.prerelease);
}
function versionTupleDiff(version, range) {
    return compareTuple(tupleOf(version), tupleOf(range));
}
/** Whether `version` is compatible with the single comparator `op base`. */
function satisfiesComparator(version, op, base) {
    const cmp = compareVersions(`${version.major}.${version.minor}.${version.patch}${version.prerelease ? '-' + version.prerelease.join('.') : ''}`, `${base.major}.${base.minor}.${base.patch}${base.prerelease ? '-' + base.prerelease.join('.') : ''}`);
    switch (op) {
        case '=': return cmp === 0;
        case '>': return cmp > 0;
        case '>=': return cmp >= 0;
        case '<': return cmp < 0;
        case '<=': return cmp <= 0;
        default: return false;
    }
}
/** Whether a prerelease version may be considered for `range`. */
function prereleaseAllowed(version, range) {
    if (version.prerelease === null)
        return true;
    // A range that itself contains a prerelease comparator may match prereleases.
    if (/[-]/.test(range))
        return true;
    // Otherwise only exact matches of the same tuple are permitted.
    const parsed = parseVersion(range);
    if (parsed === null)
        return false;
    return (version.major === parsed.major
        && version.minor === parsed.minor
        && version.patch === parsed.patch
        && parsed.prerelease !== null);
}
/**
 * Whether `version` satisfies a single atomic range token such as `^1.2.3`,
 * `~1.2`, `1.2.3`, `*`, `>=1.2.0`, or `>=1.0.0 <2.0.0`.
 */
export function satisfiesOne(version, token) {
    const parsed = parseVersion(version);
    if (parsed === null)
        return false;
    const trimmed = token.trim();
    if (trimmed === '' || trimmed === '*' || trimmed === 'x' || trimmed === 'latest')
        return true;
    // Comparator chains: ">=1.0.0 <2.0.0".
    if (/^([<>]=?|=)\s*[0-9]/.test(trimmed)) {
        const parts = trimmed.split(/\s+/);
        for (const part of parts) {
            const match = /^(<=|>=|<|>|=)?\s*(.+)$/.exec(part);
            if (match === null)
                return false;
            const op = match[1] === undefined || match[1] === '' ? '=' : match[1];
            const base = parseVersion(match[2] ?? '');
            if (base === null)
                return false;
            if (op === '=' && parsed.prerelease !== null) {
                // Allow exact prerelease match.
            }
            if (!satisfiesComparator(parsed, op, base))
                return false;
        }
        return true;
    }
    // Star-ish suffixes: "1", "1.2", "1.x", "1.2.x".
    const partial = /^(\d+)(?:\.(\d+))?(?:\.x|\.\*)?$/.exec(trimmed);
    if (partial !== null) {
        if (partial[1] !== undefined && parsed.major !== Number(partial[1]))
            return false;
        if (partial[2] !== undefined && parsed.minor !== Number(partial[2]))
            return false;
        return prereleaseAllowed(parsed, trimmed);
    }
    // Caret.
    const caret = /^\^([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)$/.exec(trimmed);
    if (caret !== null) {
        const base = parseVersion(caret[1] ?? '');
        if (base === null)
            return false;
        const diff = versionTupleDiff(parsed, base);
        if (diff < 0)
            return false;
        if (diff === 0 && base.prerelease === null && parsed.prerelease !== null)
            return false;
        if (diff === 0 && base.prerelease !== null) {
            if (comparePrerelease(parsed.prerelease, base.prerelease) < 0)
                return false;
        }
        let upper;
        if (base.major > 0)
            upper = [base.major + 1, 0, 0];
        else if (base.minor > 0)
            upper = [0, base.minor + 1, 0];
        else
            upper = [0, 0, base.patch + 1];
        if (compareTuple(tupleOf(parsed), upper) >= 0)
            return false;
        return true;
    }
    // Tilde.
    const tilde = /^~([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)$/.exec(trimmed);
    if (tilde !== null) {
        const base = parseVersion(tilde[1] ?? '');
        if (base === null)
            return false;
        const diff = versionTupleDiff(parsed, base);
        if (diff < 0)
            return false;
        const upper = [base.major, base.minor + 1, 0];
        if (compareTuple(tupleOf(parsed), upper) >= 0)
            return false;
        return true;
    }
    // Exact (including prerelease).
    const exact = parseVersion(trimmed);
    if (exact !== null) {
        return compareVersions(version.trim(), `${exact.major}.${exact.minor}.${exact.patch}${exact.prerelease ? '-' + exact.prerelease.join('.') : ''}`) === 0;
    }
    return false;
}
/** Whether `version` satisfies a full range that may use `||`. */
export function satisfies(version, range) {
    const alternatives = range.split('||');
    for (const alternative of alternatives) {
        const chain = alternative.trim();
        if (chain === '')
            continue;
        if (satisfiesOne(version, chain))
            return true;
    }
    return false;
}
/** Highest published version in `versions` that satisfies `range`, or null. */
export function maxSatisfying(versions, range) {
    let best = null;
    for (const version of versions) {
        if (!satisfies(version, range))
            continue;
        if (best === null || compareVersions(version, best) > 0)
            best = version;
    }
    return best;
}
/** Whether `range` is a bare registry range (no git/file/link/workspace prefix). */
export function isRegistryRange(range) {
    const trimmed = range.trim();
    return !(trimmed.startsWith('file:')
        || trimmed.startsWith('link:')
        || trimmed.startsWith('git')
        || trimmed.startsWith('workspace:')
        || /^[a-z]+:\/\//.test(trimmed));
}
/**
 * Whether `version` satisfies the caret range `^X.Y.Z` / `^X.Y.Z-pre`
 * (the subset this plugin's peer guard needs).
 */
export function satisfiesCaret(version, range) {
    return satisfies(version, range);
}
