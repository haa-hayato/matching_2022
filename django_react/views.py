from django.http import HttpResponse
from pymagnitude import Magnitude
#aaa


def testFunc(request, word):
    # _word = word.encode('utf-8', 'ignore')
    # _word = urllib3.uniquote(_word)
    # _word = _word.decode('utf-8')


    # chiVeデータのPATH
    model_path = "django_react/downloads/chive-1.2-mc90.magnitude"
 
    # モデルの読み込み
    wv = Magnitude(model_path)
 
    # 類似度上位10件を取得
    match = wv.most_similar(word, topn=7)

    return HttpResponse(match)