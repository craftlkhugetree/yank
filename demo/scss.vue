<template>
<!-- var变量的使用 : var(- -变量名)
我们可以在body中或者任何一个我们想要使用的变量语法的层级中定义var()变量并进行使用 -->
<!-- 
body{
    --fontSize: 18px;
    --color: #000000;
}

div-name{
    font-size : var(--fontSize);
    color: var(--color);
} -->
    <div>
        <span :key="item.color" v-for="item in list" :style="{'--text': item.text, '--color': item.color}"></span>
    </div>
</template>

<script>
export default {
    name: '',
    components: {},
    props: {},
    data() {
        return {
            list: [
                { text: '"中"', color: 'red' },
                { text: '"华"', color: 'orange' },
                { text: '"人"', color: 'yellow' },
                { text: '"民"', color: 'orange' },
                { text: '"共"', color: 'green' },
                { text: '"和"', color: 'cyan' },
                { text: '"国"', color: 'blue' }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
span::after {
    content: var(--text);
    background-color: var(--color);
}
</style>