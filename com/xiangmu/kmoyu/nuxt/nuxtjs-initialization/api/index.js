import request from '@/plugins/request'

export function list(params) {
    return request({
        url: '/sns/curriculum/selectRecommendForqt',
        method: 'get',
        params
    })
}