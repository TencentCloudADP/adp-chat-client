<template>
  <div className="line-box">
    <span className="line-list-item line-list-line1"></span>
    <span className="line-list-item line-list-line2"></span>
    <span className="line-list-item line-list-line3"></span>
    <span className="line-list-item line-list-line4"></span>
  </div>
</template>

<style scoped>
@keyframes line {
    20%,from {
        height: var(--td-size-2)
    }

    to {
        height: var(--td-size-7)
    }
}

@-webkit-keyframes line {
    20%,from {
        height: var(--td-size-2)
    }

    to {
        height: var(--td-size-7)
    }
}
.line-box {
    display: flex;
    height: var(--td-comp-size-m);
    width: var(--td-comp-size-m);
    align-items: end;
    padding: var(--td-pop-padding-m);
    font-size: 0;
    background-color: #F1F6FF;
}
.line-box>span:last-child {
    margin-right: 0
}

.line-box .line-list-item{
    display: inline-block;
    margin-right: var(--td-comp-margin-xs);
    width: var(--td-size-1);
    margin-bottom: 0;
    background-color: var(--td-brand-color);
}
.line-list-line1 {
    animation: line .6s infinite linear alternate
}

.line-list-line2 {
    animation: line .6s .2s infinite linear alternate
}

.line-list-line3 {
    animation: line .6s .4s infinite linear alternate
}

.line-list-line4 {
    animation: line .6s .6s infinite linear alternate
}
</style>
